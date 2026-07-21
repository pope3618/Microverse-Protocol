import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function AnnouncementsPage() {
  return (
    <GlassCard>
      <h1 className="font-display text-lg font-bold">公告</h1>
      <p className="mt-2 text-xs text-muted-foreground">暫無公告</p>
      <Link href="/" className="mt-4 inline-block text-xs text-primary">
        ← 返回首頁
      </Link>
    </GlassCard>
  );
}
