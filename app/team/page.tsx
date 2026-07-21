import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function TeamPage() {
  return (
    <GlassCard>
      <h1 className="font-display text-lg font-bold">團隊 / Team</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        核心貢獻者與開發者獎金池資訊。
      </p>
      <Link href="/" className="mt-4 inline-block text-xs text-primary">
        ← 返回首頁
      </Link>
    </GlassCard>
  );
}
