import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export const Toaster = () => (
  <SonnerToaster
    position="bottom-right"
    visibleToasts={3}
    toastOptions={{
      duration: 4200,
      className:
        '!w-auto !max-w-[320px] !bg-white !text-[#111111] !border !border-[#EBEBE7] !shadow-[0_8px_24px_rgba(9,31,68,0.12)] !rounded-2xl !font-sans !text-[13px] !px-4 !py-3',
      descriptionClassName: '!text-[#6B6E68] !text-[12px]',
    }}
  />
);

export const toast = sonnerToast;
