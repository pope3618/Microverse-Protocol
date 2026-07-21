"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Gift, Sparkles, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/components/language-provider";

export default function HomePage() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {/* Hero */}
      <section className="glass rounded-2xl border border-white/10 p-5 text-center">
        <p className="font-display text-2xl font-bold tracking-wide">小宇宙</p>
        <p className="mt-1 text-sm text-primary">{t("protocol")}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          鏈上秩序 · 代碼鐵律
        </p>
        <p className="text-xs text-muted-foreground">一進一出 · 三天一輪</p>
      </section>

      {/* 公告 */}
      <GlassCard>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("announcements")}</h2>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">暫無公告</p>
      </GlassCard>

      {/* 我的鏈路訂單 */}
      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("chainOrder")}</h2>
          <span className="text-xs text-muted-foreground">全部</span>
        </div>
        <div className="glass rounded-xl border border-white/10 p-4 text-center">
          <p className="text-xs text-muted-foreground">尚未開啟此鏈路</p>
          <button
            onClick={() => router.push("/donate")}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
          >
            <Gift className="size-3.5" /> 立即捐贈
          </button>
        </div>
      </GlassCard>

      {/* 我的等級 / 動態收益 */}
      <GlassCard>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("earnings")}</h2>
          <span className="text-xs text-muted-foreground">明細</span>
        </div>
        <p className="text-xs text-muted-foreground">可領取動態收益</p>
        <div className="mt-2 flex items-end justify-between">
          <span className="font-display text-2xl font-bold">0.0000</span>
        <button
          onClick={() => router.push("/earnings")}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
        >
          領取
        </button>
        </div>
      </GlassCard>

      {/* 節點 / 共識邀請 */}
      <GlassCard>
        <div className="mb-2 flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">{t("node")}</h2>
        </div>
        <p className="text-xs text-muted-foreground">共識邀請連結</p>
        <p className="mt-2 text-xs text-muted-foreground">我的邀請</p>
        <p className="mt-1 text-xs text-muted-foreground/70">暫無邀請記錄</p>
      </GlassCard>

      <Link
        href="/team"
        className="flex items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <Sparkles className="size-3.5" /> 查看團隊
      </Link>
    </div>
  );
}
