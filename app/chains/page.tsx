import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function ChainsPage() {
  return (
    <GlassCard>
      <h1 className="font-display text-lg font-bold">鏈路 / Chains</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        尚未開啟此鏈路。在此接入多链路由与节点状态。
      </p>
      <Link href="/" className="mt-4 inline-block text-xs text-primary">
        ← 返回首頁
      </Link>
    </GlassCard>
  );
}
