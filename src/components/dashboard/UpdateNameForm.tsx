'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, User } from 'lucide-react';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { cn } from '@/lib/utils';
import { updateName } from '@/lib/dashboard-actions';

interface UpdateNameFormProps {
  currentName: string | null;
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (name === currentName) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('name', name);

      const result = await updateName(formData);

      if (result.errors) {
        setError(result.errors.name || result.errors.form || 'Failed to update name');
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GlassCard className="p-6 md:p-8" hover={false}>
      <h3 className="font-display text-base font-bold text-text-primary mb-4">
        Display name
      </h3>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
              setSuccess(false);
            }}
            placeholder="Your name"
            className={cn(
              'w-full glass rounded-lg pl-10 pr-4 py-3 font-body text-sm text-text-primary',
              'placeholder:text-text-muted/60 outline-none transition-colors duration-200',
              error
                ? 'border-red-500/50 focus:border-red-500/70 focus:bg-red-500/5'
                : 'focus:border-accent-purple/50 focus:bg-accent-purple/5'
            )}
            autoComplete="name"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <MagneticButton
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </MagneticButton>

          {success && (
            <span className="flex items-center gap-1.5 text-xs text-accent-mint font-medium">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
