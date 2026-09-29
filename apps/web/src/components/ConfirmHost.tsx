'use client';

import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '@oneallhost/ui';

type Payload = {
  title: string;
  description?: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
  resolve: (ok: boolean) => void;
};

export function askConfirm(opts: Omit<Payload, 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent('onh-confirm', { detail: { ...opts, resolve } }));
  });
}

export function ConfirmHost() {
  const [payload, setPayload] = useState<Payload | null>(null);
  useEffect(() => {
    const on = (e: Event) => setPayload((e as CustomEvent).detail);
    window.addEventListener('onh-confirm', on as EventListener);
    return () => window.removeEventListener('onh-confirm', on as EventListener);
  }, []);
  return (
    <ConfirmModal
      open={Boolean(payload)}
      title={payload?.title || ''}
      description={payload?.description}
      detail={payload?.detail}
      confirmLabel={payload?.confirmLabel || 'Remove'}
      cancelLabel={payload?.cancelLabel || 'Cancel'}
      tone={payload?.tone || 'danger'}
      onClose={() => {
        payload?.resolve(false);
        setPayload(null);
      }}
      onConfirm={() => {
        payload?.resolve(true);
        setPayload(null);
      }}
    />
  );
}
