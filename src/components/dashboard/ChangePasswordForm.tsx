'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, Loader2, Lock } from 'lucide-react';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { cn } from '@/lib/utils';
import { changePassword } from '@/lib/dashboard-actions';

interface ChangePasswordFormProps {
  hasPassword: boolean;
}

export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPWs, setShowPWs] = useState({ current: false, new: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors: Record<string, string> = {};
    if (hasPassword && !currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!newPassword || newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('currentPassword', currentPassword);
      formData.set('newPassword', newPassword);
      formData.set('confirmPassword', confirmPassword);

      const result = await changePassword(formData);

      if (result.errors) {
        setErrors(result.errors);
      } else {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  function togglePW(field: 'current' | 'new' | 'confirm') {
    setShowPWs((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  const inputClass = (field: string) =>
    cn(
      'w-full glass rounded-lg px-4 py-3 pr-11 font-body text-sm text-text-primary',
      'placeholder:text-text-muted/60 outline-none transition-colors duration-200',
      errors[field]
        ? 'border-red-500/50 focus:border-red-500/70 focus:bg-red-500/5'
        : 'focus:border-accent-purple/50 focus:bg-accent-purple/5'
    );

  return (
    <GlassCard className="p-6 md:p-8" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-text-muted" />
        <h3 className="font-display text-base font-bold text-text-primary">
          {hasPassword ? 'Change password' : 'Set password'}
        </h3>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        {hasPassword && (
          <div>
            <label className="block font-body text-sm font-medium text-text-secondary mb-1.5">
              Current password
            </label>
            <div className="relative">
              <input
                type={showPWs.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }));
                }}
                placeholder="Enter current password"
                className={inputClass('currentPassword')}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePW('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showPWs.current ? 'Hide' : 'Show'}
              >
                {showPWs.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>
            )}
          </div>
        )}

        <div>
          <label className="block font-body text-sm font-medium text-text-secondary mb-1.5">
            New password
          </label>
          <div className="relative">
            <input
              type={showPWs.new ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
              }}
              placeholder="At least 8 characters"
              className={inputClass('newPassword')}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePW('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={showPWs.new ? 'Hide' : 'Show'}
            >
              {showPWs.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block font-body text-sm font-medium text-text-secondary mb-1.5">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showPWs.confirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Re-enter new password"
              className={inputClass('confirmPassword')}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePW('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={showPWs.confirm ? 'Hide' : 'Show'}
            >
              {showPWs.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.form && (
          <p className="text-xs text-red-400">{errors.form}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <MagneticButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              hasPassword ? 'Change password' : 'Set password'
            )}
          </MagneticButton>

          {success && (
            <span className="flex items-center gap-1.5 text-xs text-accent-mint font-medium">
              <Check className="w-3.5 h-3.5" />
              Password updated
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
