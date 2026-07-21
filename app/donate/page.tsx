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
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { erc20Abi, parseEther, parseUnits } from "viem";

// 演示用捐赠地址（公认的销毁地址）。本项目仅复刻交互链路，请勿转入真实资金。
const DEMO_DONATE_ADDRESS = "0x000000000000000000000000000000000000dEaD";
// 演示用 Sepolia 测试网 USDT 代币地址（demo placeholder，6 位小数）。
const DEMO_USDT_ADDRESS = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

type Currency = "ETH" | "USDT";

export default function DonatePage() {
  const { t } = useI18n();
  const [amount, setAmount] = useState("0.001");
  const [currency, setCurrency] = useState<Currency>("ETH");
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    sendTransaction,
    isPending: isSendingEth,
    data: ethTxHash,
    error: ethError,
    reset: resetEth,
  } = useSendTransaction();
  const {
    writeContract,
    isPending: isSendingUsdt,
    data: usdtTxHash,
    error: usdtError,
    reset: resetUsdt,
  } = useWriteContract();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isSending = isSendingEth || isSendingUsdt;
  const txHash = ethTxHash ?? usdtTxHash;
  const sendError = ethError ?? usdtError;

  useEffect(() => {
    setHasWallet(typeof window !== "undefined" && !!window.ethereum);
  }, []);

  const switchCurrency = (c: Currency) => {
    setCurrency(c);
    // 切换币种时清空上一次的交易结果/错误，避免混淆
    resetEth();
    resetUsdt();
    setAmount(c === "ETH" ? "0.001" : "1");
  };

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
      if (currency === "ETH") {
        sendTransaction({
          to: DEMO_DONATE_ADDRESS,
          value: parseEther(amount || "0"),
        });
      } else {
        // USDT：ERC-20 transfer(address,uint256)，USDT 为 6 位小数
        writeContract({
          address: DEMO_USDT_ADDRESS,
          abi: erc20Abi,
          functionName: "transfer",
          args: [DEMO_DONATE_ADDRESS, parseUnits(amount || "0", 6)],
        });
      }
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
              {/* 币种切换 */}
              <label className="text-xs text-muted-foreground">
                {t("currencyLabel")}
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(["ETH", "USDT"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => switchCurrency(c)}
                    className={
                      "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors " +
                      (currency === c
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-white/10 bg-black/20 text-muted-foreground hover:border-white/25")
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>

              {currency === "USDT" && (
                <p className="mt-2 text-[11px] text-amber-400/90">
                  {t("usdtNote")}
                </p>
              )}

              <label className="mt-3 block text-xs text-muted-foreground">
                {t("amountLabel")}（{currency}）
              </label>
              <input
                type="number"
                min="0"
                step={currency === "ETH" ? "0.001" : "1"}
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
                {isSending ? t("donating") : `${t("donateNow")}（${currency}）`}
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
