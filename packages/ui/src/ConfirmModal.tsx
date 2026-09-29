'use client';

import React, { useEffect } from 'react';

export function ConfirmModal({
  open,
  title,
  description,
  detail,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  detail?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  const confirmClass =
    tone === 'danger'
      ? 'bg-[#E53935] hover:bg-[#C62828] text-white'
      : 'bg-[#0D3B85] hover:bg-[#091F44] text-white';
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-[#091F44]/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-[340px] max-h-[min(88vh,560px)] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-[0_18px_50px_rgba(9,31,68,0.18)] px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-3 right-3 w-9 h-9 text-[#9AA0A6] text-xl leading-none" aria-label="Close">
          ×
        </button>
        <div className={`mx-auto mb-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-[#FDECEC]' : 'bg-[#E8EEF8]'}`}>
          <span className={`text-xl sm:text-2xl font-black ${tone === 'danger' ? 'text-[#E53935]' : 'text-[#0D3B85]'}`}>!</span>
        </div>
        <h2 id="confirm-title" className="text-base sm:text-[17px] font-extrabold text-[#111111] tracking-tight px-4">{title}</h2>
        {detail ? <div className="mt-3 rounded-2xl border border-[#EEE] px-3 py-2 text-left text-sm text-[#111] break-words">{detail}</div> : null}
        {description ? <p className="mt-3 text-[12px] leading-relaxed text-[#8A8F88]">{description}</p> : null}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onClose} className="h-11 min-h-[44px] rounded-full border border-[#E4E4E0] text-sm font-semibold text-[#111]">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={`h-11 min-h-[44px] rounded-full text-sm font-semibold ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
