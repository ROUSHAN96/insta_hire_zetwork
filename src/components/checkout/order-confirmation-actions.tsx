'use client';

import { useState } from 'react';
import { Copy, Check, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderConfirmationActionsProps {
  orderId: string;
}

export function OrderConfirmationActions({ orderId }: OrderConfirmationActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 cursor-pointer bg-background"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Copied ID</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Copy Order ID</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="rounded-xl text-xs font-semibold h-9 px-3 gap-1.5 cursor-pointer bg-background print:hidden"
      >
        <Printer className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Print Receipt</span>
      </Button>
    </div>
  );
}
