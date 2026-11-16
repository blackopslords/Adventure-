// Change this passcode before pushing to GitHub, or set VITE_ADMIN_PASSCODE in your environment.
export const OWNER_PASSCODE =
  import.meta.env.VITE_ADMIN_PASSCODE || 'kaisar2026';

export function verifyOwnerPasscode(input: string): boolean {
  return input.trim() === OWNER_PASSCODE;
}
