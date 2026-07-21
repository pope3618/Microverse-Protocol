"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "zh-Hant" | "en";

type Dict = Record<string, { "zh-Hant": string; en: string }>;

// 最小化词典：仅演示 i18n 接线，业务文案可在此扩展
const dict: Dict = {
  connect: { "zh-Hant": "連接錢包", en: "Connect Wallet" },
  protocol: { "zh-Hant": "AI共識協議", en: "AI Consensus Protocol" },
  chainOrder: { "zh-Hant": "我的鏈路訂單", en: "My Chain Orders" },
  earnings: { "zh-Hant": "我的等級", en: "My Level" },
  node: { "zh-Hant": "節點", en: "Node" },
  announcements: { "zh-Hant": "公告", en: "Announcements" },
  disconnect: { "zh-Hant": "斷開", en: "Disconnect" },
  community: { "zh-Hant": "社群", en: "Community" },
  connecting: { "zh-Hant": "連接中…", en: "Connecting…" },
  noWallet: {
    "zh-Hant": "未偵測到錢包，請安裝 MetaMask 或用內建瀏覽器的錢包開啟",
    en: "No wallet detected. Install MetaMask or open in a wallet browser",
  },
  connectError: {
    "zh-Hant": "連接失敗，請重試或檢查錢包",
    en: "Connection failed. Please retry or check your wallet",
  },
  // 捐贈頁
  donateTitle: { "zh-Hant": "捐贈 / Donate", en: "Donate" },
  donateSub: {
    "zh-Hant": "開發者獎金池常駐 · 歡迎查詢合約漏洞",
    en: "Developer bounty pool · report contract vulnerabilities",
  },
  donateDemo: {
    "zh-Hant": "演示地址（銷毀地址）· 請勿轉入真實資金",
    en: "Demo address (burn address) · do not send real funds",
  },
  copyAddr: { "zh-Hant": "複製地址", en: "Copy" },
  copied: { "zh-Hant": "已複製", en: "Copied" },
  pleaseConnect: { "zh-Hant": "請先連接錢包", en: "Please connect your wallet" },
  donateConnect: { "zh-Hant": "連接錢包", en: "Connect Wallet" },
  connectedAs: { "zh-Hant": "已連接：", en: "Connected: " },
  switchToSepolia: {
    "zh-Hant": "請先切換至 Sepolia 測試網再捐贈",
    en: "Switch to the Sepolia testnet before donating",
  },
  switching: { "zh-Hant": "切換中…", en: "Switching…" },
  switchBtn: { "zh-Hant": "切換網絡", en: "Switch Network" },
  amountLabel: { "zh-Hant": "捐贈數量（ETH）", en: "Amount (ETH)" },
  donateNow: { "zh-Hant": "立即捐贈", en: "Donate Now" },
  donating: { "zh-Hant": "捐贈中…", en: "Donating…" },
  donateSuccess: { "zh-Hant": "捐贈成功！交易哈希：", en: "Donation sent! Tx hash:" },
  donateFail: { "zh-Hant": "捐贈失敗", en: "Donation failed" },
  backHome: { "zh-Hant": "返回首頁", en: "Back to home" },
};

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (key: keyof typeof dict) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-Hant");

  useEffect(() => {
    const saved = window.localStorage.getItem("mv-locale") as Locale | null;
    if (saved === "zh-Hant" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("mv-locale", l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "zh-Hant" ? "en" : "zh-Hant");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: keyof typeof dict) => dict[key][locale],
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
