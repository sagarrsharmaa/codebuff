'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { deleteAccount } from '@/lib/dashboard-actions';

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const CONFIRM_REQUIRED = 'DELETE';

  async function handleDelete() {
    if (confirmText !== CONFIRM_REQUIRED) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await deleteAccount();
      if (result.errors) {
        setError(result.errors.form || 'Failed to delete account');
        setIsLoading(false);
      }
      // If successful, deleteAccount calls signOut which redirects
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Danger zone card trigger */}
      <GlassCard className="p-6 md:p-8" hover={false} glow={null}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-display text-base font-bold text-text-primary">
                Danger Zone
              </h3>
            </div>
            <p className="font-body text-sm text-text-muted">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <MagneticButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30"
          >
            Delete account
          </MagneticButton>
        </div>
      </GlassCard>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLoading && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6 md:p-8" hover={false}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-text-primary">
                        Delete account
                      </h2>
                      <p className="font-body text-xs text-text-muted">
                        This action is permanent
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => !isLoading && setIsOpen(false)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Warning */}
                <div className="mb-5 p-3.5 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="font-body text-sm text-red-300 leading-relaxed">
                    This will permanently delete your account, your subscription, and all associated data. This cannot be undone.
                  </p>
                </div>

                {/* Confirmation input */}
                <div className="mb-5">
                  <label
                    htmlFor="delete-confirm"
                    className="block font-body text-sm font-medium text-text-secondary mb-1.5"
                  >
                    Type <span className="text-red-400 font-mono font-bold">{CONFIRM_REQUIRED}</span> to confirm
                  </label>
                  <input
                    id="delete-confirm"
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRM_REQUIRED}
                    disabled={isLoading}
                    className="w-full glass rounded-lg px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-red-500/50 focus:bg-red-500/5 transition-colors duration-200"
                    autoComplete="off"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="mb-4 font-body text-sm text-red-400">{error}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="flex-1 glass glass-hover rounded-full px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={confirmText !== CONFIRM_REQUIRED || isLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/40 text-white rounded-full px-4 py-2.5 font-body text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete my account'
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
