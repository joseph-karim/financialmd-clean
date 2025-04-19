// Simple mock implementation of the toast hook
export interface ToastProps {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props);
    // In a real implementation, this would show a toast notification
  };

  return { toast };
}
