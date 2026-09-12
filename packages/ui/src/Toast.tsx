import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-white text-black border border-gray-200 shadow-lg rounded-md font-sans',
        descriptionClassName: 'text-gray-500',
      }}
    />
  );
};

export const toast = sonnerToast;
