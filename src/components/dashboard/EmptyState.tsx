import { GlassCard } from '@/components/primitives/GlassCard';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <GlassCard className={cn('p-8 text-center', className)} hover={false}>
      <div className="flex flex-col items-center gap-3 py-4">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-background-card flex items-center justify-center text-text-muted">
            {icon}
          </div>
        )}
        <h3 className="font-display text-base font-bold text-text-primary">{title}</h3>
        <p className="font-body text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </GlassCard>
  );
}
