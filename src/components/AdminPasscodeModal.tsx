import { Lock, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { verifyOwnerPasscode } from '../config/adminConfig';

interface AdminPasscodeModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export function AdminPasscodeModal({
  open,
  onClose,
  onUnlock,
}: AdminPasscodeModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPasscode('');
      setError('');
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!verifyOwnerPasscode(passcode)) {
      setError('Incorrect owner passcode.');
      return;
    }
    onUnlock();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Owner access verification"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0D0D12] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-white">
              Owner Edit Access
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E11D48] text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed">
            Enter your owner passcode to unlock text editing, Discord screenshot uploads, and custom music controls.
          </p>

          <div>
            <label
              htmlFor="owner-passcode-input"
              className="block text-xs font-medium text-neutral-300 mb-1.5"
            >
              Owner Passcode
            </label>
            <input
              ref={inputRef}
              id="owner-passcode-input"
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter passcode"
              className="w-full px-3.5 py-2.5 text-sm text-white bg-[#070709] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48]"
            />
            {error && (
              <p role="alert" className="text-xs text-rose-400 mt-1.5">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
            >
              Unlock Editor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
