'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OrderConfirmationToastProps {
  customerEmail: string;
}

export function OrderConfirmationToast({ customerEmail }: OrderConfirmationToastProps) {
  const toast = useToast();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      const timer = setTimeout(() => {
        toast.success(
          'Order Confirmed! 🎉',
          `We've sent your receipt and tracking details to ${customerEmail}`
        );
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [customerEmail, toast]);

  return null;
}
