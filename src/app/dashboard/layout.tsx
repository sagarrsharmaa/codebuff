import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/auth';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const navLinks = [
    { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { href: '/dashboard/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background-base">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,92,252,0.06), transparent 70%)',
          }}
        />
      </div>

      <DashboardNav
        links={navLinks}
        signOutForm={
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/login' });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium text-text-muted hover:text-text-primary hover:bg-background-card transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        }
      />

      {/* Page content */}
      <main className="relative z-10 max-w-5xl mx-auto px-gutter md:px-gutter-lg py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
