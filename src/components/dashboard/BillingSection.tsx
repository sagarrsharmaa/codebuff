import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { CreditCard, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { createBillingPortalAction } from '@/lib/stripe-actions';

interface BillingSectionProps {
  subscription: {
    status: string;
    currentPeriodEnd: Date | null;
    stripePriceId: string | null;
    stripeCustomerId: string | null;
  } | null;
  planLabel: string;
}

function getStatusDisplay(status: string | undefined) {
  switch (status) {
    case 'ACTIVE':
    case 'TRIALING':
      return {
        label: status === 'TRIALING' ? 'Trialing' : 'Active',
        bg: 'bg-accent-mint/10',
        text: 'text-accent-mint',
        border: 'border-accent-mint/20',
        Icon: CheckCircle,
      };
    case 'CANCELED':
      return {
        label: 'Canceled',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        Icon: AlertCircle,
      };
    case 'PAST_DUE':
      return {
        label: 'Past Due',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        Icon: AlertCircle,
      };
    case 'INCOMPLETE':
      return {
        label: 'Incomplete',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        Icon: AlertCircle,
      };
    default:
      return null;
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function BillingSection({ subscription, planLabel }: BillingSectionProps) {
  const statusDisplay = getStatusDisplay(subscription?.status);

  return (
    <GlassCard className="p-6 md:p-8" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-text-muted" />
        <h3 className="font-display text-base font-bold text-text-primary">
          Billing & Plan
        </h3>
      </div>

      <div className="space-y-4">
        {/* Current plan row */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-background-card">
          <div>
            <p className="font-body text-sm font-medium text-text-primary">
              {planLabel}
            </p>
            <p className="font-body text-xs text-text-muted mt-0.5">
              {subscription?.currentPeriodEnd
                ? `Renewal: ${formatDate(subscription.currentPeriodEnd)}`
                : subscription
                  ? 'Renewal: —'
                  : 'No active subscription'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusDisplay && (
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusDisplay.text} ${statusDisplay.bg} ${statusDisplay.border}`}
              >
                <statusDisplay.Icon className="w-3 h-3" />
                {statusDisplay.label}
              </span>
            )}
            {!subscription && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Manage billing button */}
        {subscription?.stripeCustomerId ? (
          <form action={createBillingPortalAction}>
            <MagneticButton
              type="submit"
              variant="secondary"
              size="sm"
              className="w-full justify-center"
            >
              <ExternalLink className="w-4 h-4" />
              Manage billing
            </MagneticButton>
          </form>
        ) : (
          <a
            href="/pricing"
            className="block w-full text-center glass glass-hover rounded-full px-6 py-3 font-body text-sm font-medium text-text-primary transition-all duration-200"
          >
            Upgrade your plan
          </a>
        )}
      </div>
    </GlassCard>
  );
}
