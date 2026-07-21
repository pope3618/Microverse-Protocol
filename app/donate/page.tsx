"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/components/language-provider";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { parseEther } from "viem";

// 演示用捐赠地址（公认的销毁地址）。本项目仅复刻交互链路，请勿转入真实资金。
const DEMO_DONATE_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export default function DonatePage() {
  const { t } = useI18n();
  const [amount, setAmount] = useState("0.001");
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isSending, data: txHash, error: sendError } =
    useSendTransaction();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    setHasWallet(typeof window !== "undefined" && !!window.ethereum);
  }, []);

  const onDonate = () => {
    if (!hasWallet) return;
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    if (chain?.id !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
      return;
    }
    try {
      sendTransaction({
        to: DEMO_DONATE_ADDRESS,
        value: parseEther(amount || "0"),
      });
    } catch {
      /* 错误由 sendError 展示 */
    }
  };

  const onCopy = () => {
    navigator.clipboard?.writeText(DEMO_DONATE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <h1 className="font-display text-lg font-bold">{t("donateTitle")}</h1>
        <p className="mt-2 text-xs text-muted-foreground">{t("donateSub")}</p>
      </GlassCard>

      <GlassCard>
        <p className="text-[11px] text-amber-400/90">{t("donateDemo")}</p>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <code className="truncate text-[11px] text-muted-foreground">
            {DEMO_DONATE_ADDRESS}
          </code>
          <button
            onClick={onCopy}
            className="shrink-0 inline-flex items-center gap-1 text-xs text-primary"
          >
            <Copy className="size-3.5" /> {copied ? t("copied") : t("copyAddr")}
          </button>
        </div>
      </GlassCard>

      {/* 状态：未检测到钱包扩展 */}
      {hasWallet === false && (
        <GlassCard>
          <p className="text-xs text-amber-400/90">{t("noWallet")}</p>
        </GlassCard>
      )}

      {/* 未连接钱包 */}
      {hasWallet !== false && !isConnected && (
        <GlassCard>
          <p className="text-xs text-muted-foreground">{t("pleaseConnect")}</p>
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-60"
          >
            {isConnecting && <Loader2 className="size-3.5 animate-spin" />}
            {isConnecting ? t("connecting") : t("donateConnect")}
          </button>
        </GlassCard>
      )}

      {/* 已连接钱包 */}
      {isConnected && (
        <GlassCard>
          <p className="text-xs text-muted-foreground">
            {t("connectedAs")} <span className="text-primary">{shortAddr}</span>
          </p>

          {chain?.id !== sepolia.id ? (
            <div className="mt-3">
              <p className="text-xs text-amber-400/90">{t("switchToSepolia")}</p>
              <button
                onClick={() => switchChain({ chainId: sepolia.id })}
                disabled={isSwitching}
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-60"
              >
                {isSwitching && <Loader2 className="size-3.5 animate-spin" />}
                {isSwitching ? t("switching") : t("switchBtn")}
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <label className="text-xs text-muted-foreground">
                {t("amountLabel")}
              </label>
              <input
                type="number"
                min="0"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                onClick={onDonate}
                disabled={isSending}
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background disabled:opacity-60"
              >
                {isSending && <Loader2 className="size-4 animate-spin" />}
                {isSending ? t("donating") : t("donateNow")}
              </button>
            </div>
          )}

          {txHash && (
            <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
              <p className="text-xs text-primary">{t("donateSuccess")}</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary underline"
              >
                {txHash.slice(0, 10)}… <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {sendError && (
            <p className="mt-3 text-xs text-red-400">
              {t("donateFail")}：{String(sendError.message).slice(0, 80)}
            </p>
          )}

          <button
            onClick={() => disconnect()}
            className="mt-3 text-[11px] text-muted-foreground underline"
          >
            {t("disconnect")}
          </button>
        </GlassCard>
      )}

      <Link
        href="/"
        className="text-center text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        ← {t("backHome")}
      </Link>
    </div>
  );
}
