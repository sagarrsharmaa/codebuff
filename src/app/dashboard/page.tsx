import { getDashboardData } from '@/lib/dashboard-actions';
import { GlassCard } from '@/components/primitives/GlassCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  User,
  Mail,
  Calendar,
  Activity,
  Clock,
  CreditCard,
} from 'lucide-react';

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
}

/** Metric tile reused from the DashboardMockup visual language */
function MetricTile({
  label,
  value,
  change,
  color,
}: {
  label: string;
  value: string;
  change?: string;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-background-card p-3.5 md:p-4 space-y-1.5">
      <p className="font-body text-xs text-text-muted uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl md:text-2xl font-bold text-text-primary">
          {value}
        </span>
        {change && (
          <span className={`font-body text-xs font-medium ${color}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* ── Welcome header ── */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-display">
          Welcome back{data.name ? `, ${data.name.split(' ')[0]}` : ''}
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Here&apos;s your Codebuff overview
        </p>
      </div>

      {/* ── Account info card ── */}
      <GlassCard className="p-6 md:p-8" hover={false} glow="purple">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4">
          Account details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm p-3.5 rounded-lg bg-background-card">
            <User className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Name</p>
              <p className="text-text-primary font-medium">
                {data.name || 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm p-3.5 rounded-lg bg-background-card">
            <Mail className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Email</p>
              <p className="text-text-primary font-medium">{data.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm p-3.5 rounded-lg bg-background-card">
            <Calendar className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Member since</p>
              <p className="text-text-primary font-medium">
                {formatDate(data.createdAt)} ({timeAgo(data.createdAt)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm p-3.5 rounded-lg bg-background-card">
            <CreditCard className="w-4 h-4 text-text-muted shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Current plan</p>
              <p className="text-text-primary font-medium">
                <span className="inline-flex items-center gap-1.5">
                  Free
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                    Starter
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Usage metrics (placeholder — designed empty state) ── */}
      <div>
        <h2 className="font-display text-lg font-bold text-text-primary mb-4">
          Usage
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricTile
            label="AI Actions"
            value="0"
            change="—"
            color="text-text-muted"
          />
          <MetricTile
            label="Lines Generated"
            value="0"
            change="—"
            color="text-text-muted"
          />
          <MetricTile
            label="Build Success"
            value="—"
            change="—"
            color="text-text-muted"
          />
          <MetricTile
            label="Dev Hours Saved"
            value="0"
            change="—"
            color="text-text-muted"
          />
        </div>
      </div>

      {/* ── Mini chart placeholder (designed empty state) ── */}
      <GlassCard className="p-6 md:p-8" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-text-muted" />
            <h3 className="font-display text-base font-bold text-text-primary">
              Weekly Activity
            </h3>
          </div>
          <span className="font-body text-xs text-text-muted">—</span>
        </div>

        {/* Empty bar chart — 12 zero-height bars with subtle border */}
        <div className="flex items-end gap-1.5 h-24 mb-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-background-card border border-border-subtle"
              style={{ height: '8px' }}
            />
          ))}
        </div>

        <p className="font-body text-xs text-text-muted text-center">
          No activity yet — start using Codebuff to see your stats here
        </p>
      </GlassCard>

      {/* ── Recent activity (placeholder — designed empty state) ── */}
      <div>
        <h2 className="font-display text-lg font-bold text-text-primary mb-4">
          Recent activity
        </h2>
        <EmptyState
          title="No activity yet"
          description="Your recent AI actions, code generations, and bug fixes will appear here as you use Codebuff."
          icon={<Clock className="w-6 h-6" />}
          className="w-full"
        />
      </div>
    </div>
  );
}
