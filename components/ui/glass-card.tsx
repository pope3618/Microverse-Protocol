import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "glass rounded-2xl border border-white/10 p-4",
        className,
      )}
      {...props}
    />
  );
}
