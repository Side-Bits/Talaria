import { use } from 'react';

import { ToastContext } from '@/contexts/toastContext';
import type { ToastService } from '@/domain/toast';

export function useToast(): ToastService {
  const context = use(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider />');
  }

  return context;
}
