'use client';

import React from 'react';

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
  if (!open) return null;
  const confirmClass =
    tone === 'danger'
      ? 'bg-[#E53935] hover:bg-[#C62828] text-white'
      : 'bg-[#0D3B85] hover:bg-[#091F44] text-white';
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#091F44]/25 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-[340px] rounded-[28px] bg-white shadow-[0_18px_50px_rgba(9,31,68,0.18)] p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[#9AA0A6] text-lg leading-none" aria-label="Close">
          ×
        </button>
        <div className={`mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-[#FDECEC]' : 'bg-[#E8EEF8]'}`}>
          <span className={`text-2xl font-black ${tone === 'danger' ? 'text-[#E53935]' : 'text-[#0D3B85]'}`}>!</span>
        </div>
        <h2 id="confirm-title" className="text-[17px] font-extrabold text-[#111111] tracking-tight">{title}</h2>
        {detail ? <div className="mt-3 rounded-2xl border border-[#EEE] px-3 py-2 text-left text-sm text-[#111]">{detail}</div> : null}
        {description ? <p className="mt-3 text-[12px] leading-relaxed text-[#8A8F88]">{description}</p> : null}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onClose} className="h-11 rounded-full border border-[#E4E4E0] text-sm font-semibold text-[#111]">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={`h-11 rounded-full text-sm font-semibold ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
