import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardClient from './DashboardClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Dashboard – EasyFITA',
  description: 'Manage your EasyFITA account.',
};

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login?returnTo=/dashboard');
  }

  // Fetch full user with profiles to pass initial data to client
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { mechanicProfile: true, clientProfile: true },
  });

  if (!user) {
    redirect('/auth/login');
  }

  return <DashboardClient initialUser={user} />;
}
