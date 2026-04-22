import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['AVAILABLE', 'BUSY', 'EN_ROUTE', 'OFFLINE'];

// Mechanic updates their own availability status
export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'MECHANIC') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { status } = await request.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const profile = await prisma.mechanicProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) return NextResponse.json({ error: 'Mechanic profile not found' }, { status: 404 });
    if (profile.approval !== 'APPROVED') {
      return NextResponse.json({ error: 'Account not yet approved' }, { status: 403 });
    }

    const updated = await prisma.mechanicProfile.update({
      where: { userId: session.userId },
      data: { status },
    });

    return NextResponse.json({ success: true, status: updated.status });
  } catch (err) {
    console.error('mechanic status error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
