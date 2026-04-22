import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.phone !== process.env.ADMIN_PHONE) return null;
  return session;
}

// PATCH /api/admin/mechanics/[id] — approve or reject a mechanic
export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { approval, rejectedNote } = await request.json();

  if (!['APPROVED', 'REJECTED'].includes(approval)) {
    return NextResponse.json({ error: 'Invalid approval value' }, { status: 400 });
  }

  const profile = await prisma.mechanicProfile.findUnique({ where: { id } });
  if (!profile) return NextResponse.json({ error: 'Mechanic not found' }, { status: 404 });

  const updated = await prisma.mechanicProfile.update({
    where: { id },
    data: {
      approval,
      rejectedNote: approval === 'REJECTED' ? (rejectedNote ?? null) : null,
      // When approved set online status to OFFLINE (mechanic activates themselves)
      status: approval === 'APPROVED' ? 'OFFLINE' : profile.status,
    },
    include: { user: { select: { name: true, phone: true } } },
  });

  return NextResponse.json({ success: true, mechanic: updated });
}
