import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin(request) {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.phone !== process.env.ADMIN_PHONE) return null;
  return session;
}

// GET /api/admin/mechanics — list all mechanics grouped by approval status
export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const mechanics = await prisma.mechanicProfile.findMany({
    include: { user: { select: { id: true, name: true, phone: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ mechanics });
}
