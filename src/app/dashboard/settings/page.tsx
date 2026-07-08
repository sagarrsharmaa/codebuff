import { getDashboardData } from '@/lib/dashboard-actions';
import { UpdateNameForm } from '@/components/dashboard/UpdateNameForm';
import { ChangePasswordForm } from '@/components/dashboard/ChangePasswordForm';
import { ConnectedAccounts } from '@/components/dashboard/ConnectedAccounts';
import { DeleteAccountModal } from '@/components/dashboard/DeleteAccountModal';
import { BillingSection } from '@/components/dashboard/BillingSection';

export default async function SettingsPage() {
  const data = await getDashboardData();
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-display">
          Settings
        </h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Billing */}
      <BillingSection subscription={data.subscription} planLabel={data.planLabel} />

      {/* Update name */}
      <UpdateNameForm currentName={data.name} />

      {/* Change password */}
      <ChangePasswordForm hasPassword={data.hasPassword} />

      {/* Connected accounts (REAL DB DATA) */}
      <ConnectedAccounts accounts={data.accounts} />

      {/* Danger zone */}
      <DeleteAccountModal />
    </div>
  );
}
