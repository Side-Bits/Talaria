export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly title?: string;
  readonly variant: ToastVariant;
  readonly duration: number;
}

export interface ToastService {
  showToast: (options: ToastOptions) => void;
  dismissToast: () => void;
}

export const DEFAULT_TOAST_DURATION = 4000;

export function createToast(options: ToastOptions, id: number): Toast {
  const duration = options.duration ?? DEFAULT_TOAST_DURATION;

  return {
    id,
    message: options.message,
    title: options.title,
    variant: options.variant ?? 'info',
    duration: Number.isFinite(duration) && duration >= 0
      ? duration
      : DEFAULT_TOAST_DURATION,
  };
}
