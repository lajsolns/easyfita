import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { mechanicProfile: true, clientProfile: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const isAdmin = user.phone === process.env.ADMIN_PHONE;

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isAdmin,
        clientProfile: user.clientProfile,
        mechanicProfile: user.mechanicProfile,
      },
    });
  } catch (err) {
    console.error('me error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
