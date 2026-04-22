import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizePhone, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, code, name, role, carMake, carModel, carYear, specialty, experience, location } = body;

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and OTP code are required' }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);

    // Find the latest valid OTP
    const otp = await prisma.otp.findFirst({
      where: {
        phone: normalizedPhone,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json({ error: 'OTP expired or not found. Please request a new one.' }, { status: 400 });
    }

    if (otp.code !== code) {
      return NextResponse.json({ error: 'Incorrect OTP code. Please try again.' }, { status: 400 });
    }

    // Mark OTP as used
    await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });

    if (!user) {
      // New user — name and role are required
      if (!name || !role) {
        return NextResponse.json({ error: 'Name and role are required for new accounts' }, { status: 400 });
      }
      user = await prisma.user.create({
        data: { phone: normalizedPhone, name, role },
      });

      // Create role-specific profile
      if (role === 'CLIENT') {
        await prisma.clientProfile.create({
          data: { userId: user.id, carMake, carModel, carYear },
        });
      } else if (role === 'MECHANIC') {
        if (!specialty || !experience || !location) {
          return NextResponse.json(
            { error: 'Specialty, experience, and location are required for mechanic accounts' },
            { status: 400 }
          );
        }
        await prisma.mechanicProfile.create({
          data: { userId: user.id, specialty, experience, location },
        });
      }
    }

    // Fetch user with profile for JWT
    const full = await prisma.user.findUnique({
      where: { id: user.id },
      include: { mechanicProfile: true, clientProfile: true },
    });

    const isAdmin = normalizedPhone === process.env.ADMIN_PHONE;

    const tokenPayload = {
      userId: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isAdmin,
      approval: full?.mechanicProfile?.approval ?? null,
    };

    const token = await signToken(tokenPayload);
    const response = NextResponse.json({ success: true, user: tokenPayload });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
