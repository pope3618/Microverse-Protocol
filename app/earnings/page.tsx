import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function EarningsPage() {
  return (
    <GlassCard>
      <h1 className="font-display text-lg font-bold">收益 / Earnings</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        可領取動態收益：<span className="text-foreground">0.0000</span>
      </p>
      <Link href="/" className="mt-4 inline-block text-xs text-primary">
        ← 返回首頁
      </Link>
    </GlassCard>
  );
}
