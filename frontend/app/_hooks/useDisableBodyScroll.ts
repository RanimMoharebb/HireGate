"use client";

import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow: string | undefined;

/**
 * Disable body scroll while mounted. Restores the previous overflow
 * value when the last caller unmounts. Safe for SSR (no-op server-side).
 */
export function useDisableBodyScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled]);
}

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
