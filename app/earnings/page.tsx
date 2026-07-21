"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Coins } from "lucide-react";
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

// 演示用「收益分发合约」地址（销毁地址占位）。仅复刻交互链路，请勿转入真实资金。
const DEMO_CLAIM_CONTRACT = "0x000000000000000000000000000000000000dEaD";
// claim() 函数选择器：keccak256("claim()")[:4]
const CLAIM_SELECTOR = "0x4e71d92d";

// 演示用「可领取收益」数值（真实项目应从合约读取）
const CLAIMABLE = "0.0000";

export default function EarningsPage() {
  const { t } = useI18n();
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isClaiming, data: txHash, error: claimError } =
    useSendTransaction();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    setHasWallet(typeof window !== "undefined" && !!window.ethereum);
  }, []);

  const onClaim = () => {
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
      // 调用收益合约的 claim() —— 发起真实的链上交易（无 value，仅 calldata）
      sendTransaction({ to: DEMO_CLAIM_CONTRACT, data: CLAIM_SELECTOR });
    } catch {
      /* 错误由 claimError 展示 */
    }
  };

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-primary" />
          <h1 className="font-display text-lg font-bold">{t("claimTitle")}</h1>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("claimSub")}</p>
      </GlassCard>

      {/* 可领取收益 */}
      <GlassCard>
        <p className="text-xs text-muted-foreground">{t("claimableLabel")}</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-display text-3xl font-bold">{CLAIMABLE}</span>
          <span className="pb-1 text-xs text-muted-foreground">ETH</span>
        </div>
        <p className="mt-2 text-[11px] text-amber-400/90">{t("claimDemo")}</p>
      </GlassCard>

      {/* 未检测到钱包 */}
      {hasWallet === false && (
        <GlassCard>
          <p className="text-xs text-amber-400/90">{t("noWallet")}</p>
        </GlassCard>
      )}

      {/* 未连接 */}
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

      {/* 已连接 */}
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
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background disabled:opacity-60"
            >
              {isClaiming && <Loader2 className="size-4 animate-spin" />}
              {isClaiming ? t("claiming") : t("claimNow")}
            </button>
          )}

          {txHash && (
            <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
              <p className="text-xs text-primary">{t("claimSuccess")}</p>
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

          {claimError && (
            <p className="mt-3 text-xs text-red-400">
              {t("claimFail")}：{String(claimError.message).slice(0, 80)}
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
