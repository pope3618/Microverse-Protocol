"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Languages, Wallet, Loader2 } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useI18n } from "./language-provider";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function GlassNav() {
  const { t, locale, toggle } = useI18n();

  const { address, isConnected } = useAccount();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // 客户端检测是否存在注入式钱包（window.ethereum）。SSR 阶段为 false，
  // 挂载后再更新，避免 hydration 不一致。
  const [hasWallet, setHasWallet] = useState(true);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setHasWallet(
      typeof window !== "undefined" &&
        typeof (window as unknown as { ethereum?: unknown }).ethereum !==
          "undefined",
    );
  }, []);

  // 连接失败时给出内联提示
  useEffect(() => {
    if (error) setHint(t("connectError"));
  }, [error, t]);

  function handleConnect() {
    setHint(null);
    const injectedAvailable =
      typeof window !== "undefined" &&
      typeof (window as unknown as { ethereum?: unknown }).ethereum !==
        "undefined";
    if (!injectedAvailable) {
      setHasWallet(false);
      setHint(t("noWallet"));
      return;
    }
    connect({ connector: injected() });
  }

  return (
    <header className="glass sticky top-0 z-40 flex h-13 flex-col bg-background/70 px-4 backdrop-blur-md">
      <div className="flex h-13 items-center justify-between gap-2">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="font-display truncate text-lg font-semibold tracking-wide">
            Microverse Protocol
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          {isConnected && address ? (
            <button
              onClick={() => disconnect()}
              className="glass flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-2 text-xs text-foreground/90 transition-colors hover:text-primary"
              title={address}
            >
              <Wallet className="size-3.5 text-primary" />
              <span>{truncate(address)}</span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="glass flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-2 text-xs text-foreground/90 transition-colors hover:text-primary disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Wallet className="size-3.5" />
              )}
              <span>{isPending ? t("connecting") : t("connect")}</span>
            </button>
          )}

          <button
            onClick={toggle}
            className="glass flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-2 text-xs text-foreground/90 transition-colors hover:text-primary"
            aria-label="switch language"
          >
            <Languages className="size-3.5 text-primary" />
            <span>{locale === "zh-Hant" ? "繁" : "EN"}</span>
            <ChevronDown className="size-3 text-muted-foreground transition-transform" />
          </button>
        </div>
      </div>

      {hint && (
        <div className="pb-2 text-center text-[11px] leading-tight text-amber-400/90">
          {hint}
        </div>
      )}
    </header>
  );
}
