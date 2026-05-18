"use client";

import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow: string | undefined;

/**
 * Disable body scroll while mounted. Restores the previous overflow
 * value when the last caller unmounts. Safe for SSR (no-op server-side).
 */
export function useDisableBodyScroll() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    lockCount += 1;

    return () => {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.body.style.overflow = savedOverflow ?? '';
          savedOverflow = undefined;
          return;
        }

        // Safety: if for some reason the modal DOM roots are gone but lockCount
        // is not zero (imbalanced), restore overflow after a tick.
        // We look for common modal root selectors used across the app.
        setTimeout(() => {
          try {
            const modalRoots = document.querySelectorAll('div.fixed.inset-0, [role="dialog"], .modal-root');
            if (modalRoots.length === 0) {
              lockCount = 0;
              document.body.style.overflow = savedOverflow ?? '';
              savedOverflow = undefined;
            }
          } catch {
            // noop
          }
        }, 0);
    };
  }, []);
}

/**
 * Forcefully restore body scroll. Use when a modal close path might have
 * skipped the hook cleanup (defensive).
 */
export function restoreBodyScroll() {
  try {
    lockCount = 0;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = savedOverflow ?? '';
    }
    savedOverflow = undefined;
  } catch {
    // noop
  }
}
