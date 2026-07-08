import { GlassCard } from '@/components/primitives/GlassCard';

interface ConnectedAccountsProps {
  accounts: { provider: string; type: string }[];
}

const providerLabels: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
  credentials: 'Email & Password',
};

const providerIcons: Record<string, React.ReactNode> = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
};

export function ConnectedAccounts({ accounts }: ConnectedAccountsProps) {
  const emailPasswordExists = accounts.some((a) => a.provider === 'credentials');
  const oauthAccounts = accounts.filter((a) => a.provider !== 'credentials');

  return (
    <GlassCard className="p-6 md:p-8" hover={false}>
      <h3 className="font-display text-base font-bold text-text-primary mb-4">
        Connected accounts
      </h3>

      <div className="space-y-3">
        {/* Email & Password */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-background-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <span className="text-xs font-bold text-accent-purple">@</span>
            </div>
            <div>
              <p className="font-body text-sm font-medium text-text-primary">
                Email & Password
              </p>
              <p className="font-body text-xs text-text-muted">
                {emailPasswordExists ? 'Password authentication' : 'Set a password to enable'}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            emailPasswordExists
              ? 'bg-accent-mint/10 text-accent-mint border border-accent-mint/20'
              : 'bg-background-card text-text-muted border border-border-subtle'
          }`}>
            {emailPasswordExists ? 'Connected' : 'Not set'}
          </span>
        </div>

        {/* OAuth accounts */}
        {['google', 'github'].map((provider) => {
          const connected = oauthAccounts.find((a) => a.provider === provider);
          return (
            <div
              key={provider}
              className="flex items-center justify-between p-3.5 rounded-lg bg-background-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background-card flex items-center justify-center">
                  {providerIcons[provider] || (
                    <span className="text-xs font-bold text-text-muted">
                      {provider[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-text-primary">
                    {providerLabels[provider] || provider}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    {connected
                      ? 'Connected — sign in with one click'
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                connected
                  ? 'bg-accent-mint/10 text-accent-mint border border-accent-mint/20'
                  : 'bg-background-card text-text-muted border border-border-subtle'
              }`}>
                {connected ? 'Connected' : 'Available'}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
