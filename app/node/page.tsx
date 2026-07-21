import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function NodePage() {
  return (
    <GlassCard>
      <h1 className="font-display text-lg font-bold">節點 / Node</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        共識邀請連結 · 我的邀請 · 暫無邀請記錄
      </p>
      <Link href="/" className="mt-4 inline-block text-xs text-primary">
        ← 返回首頁
      </Link>
    </GlassCard>
  );
}
