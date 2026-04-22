import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint — returns only APPROVED mechanics that are not OFFLINE
export async function GET() {
  try {
    const mechanics = await prisma.mechanicProfile.findMany({
      where: {
        approval: 'APPROVED',
        status: { not: 'OFFLINE' },
      },
      include: {
        user: { select: { name: true, phone: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const data = mechanics.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      phone: m.user.phone,
      specialty: m.specialty,
      lat: m.lat,
      lng: m.lng,
      status: m.status,
      rating: m.rating,
      totalJobs: m.totalJobs,
      location: m.location,
    }));

    return NextResponse.json({ mechanics: data });
  } catch (err) {
    console.error('mechanics route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
