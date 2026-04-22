import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminClient from './AdminClient';

export const metadata = {
  title: 'Admin Panel – EasyFITA',
};

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login?returnTo=/admin');
  }

  // Verify Admin using the parsed phone number
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.phone !== process.env.ADMIN_PHONE) {
    // If not admin, send them to their regular dashboard
    redirect('/dashboard');
  }

  // Pre-fetch all mechanics
  const mechanics = await prisma.mechanicProfile.findMany({
    include: { user: { select: { name: true, phone: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminClient initialMechanics={mechanics} />;
}
