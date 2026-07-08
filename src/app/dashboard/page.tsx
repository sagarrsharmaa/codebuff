import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-background-base px-gutter md:px-gutter-lg py-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,92,252,0.06), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary tracking-display">
            Dashboard
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Welcome back, {user.name || 'there'}
          </p>
        </div>

        {/* User card */}
        <GlassCard className="p-6 md:p-8 mb-6" hover={false} glow="purple">
          <h2 className="font-display text-lg font-bold text-text-primary mb-4">
            Account details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-text-secondary">Name:</span>
              <span className="text-text-primary font-medium">
                {user.name || 'Not set'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-text-secondary">Email:</span>
              <span className="text-text-primary font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-text-secondary">User ID:</span>
              <span className="text-text-primary font-medium font-mono text-xs truncate max-w-[250px]">
                {user.id}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Sign out */}
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <MagneticButton
            type="submit"
            variant="secondary"
            size="md"
            className="w-full justify-center"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </MagneticButton>
        </form>
      </div>
    </div>
  );
}
