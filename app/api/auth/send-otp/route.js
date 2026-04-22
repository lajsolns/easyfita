import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizePhone, generateOtp } from '@/lib/auth';
import { sendOtp } from '@/lib/sms';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);

    // Rate limit: max 3 OTPs per phone in 10 minutes
    const recentCount = await prisma.otp.count({
      where: {
        phone: normalizedPhone,
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });

    if (recentCount >= 3) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 10 minutes before trying again.' },
        { status: 429 }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otp.create({
      data: { phone: normalizedPhone, code, expiresAt },
    });

    const result = await sendOtp(normalizedPhone, code);

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }

    // In sandbox/dev mode, return the OTP so users can see it on screen
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
