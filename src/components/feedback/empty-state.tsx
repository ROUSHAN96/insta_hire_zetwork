import * as React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xs",
        className
      )}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground border border-border/50">
        {icon || <PackageOpen className="size-8 stroke-1" />}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6 w-full sm:w-auto">{action}</div>}
    </div>
  );
}
