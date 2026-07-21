import Link from "next/link";

const footerLinks = [
  { label: "審計", href: "#" },
  { label: "開源", href: "#" },
  { label: "知識庫", href: "#" },
];

// 社区外链（复刻 microvse.com 的社交矩阵）
const communityLinks = [
  { label: "Telegram", href: "https://t.me/Microverse_Web3" },
  { label: "X", href: "https://x.com/microverse_web3" },
  { label: "Medium", href: "https://medium.com/@Microverse_Web3" },
  { label: "DeBox", href: "https://m.debox.pro/group?id=c8wmh82q" },
  { label: "Linktree", href: "https://linktr.ee/Microverse_Web3" },
  { label: "Gamma", href: "https://microverse-oslczaf.gamma.site" },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 px-4 pb-4">
      <div className="glass flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-xs text-muted-foreground">
        {footerLinks.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="glass mt-2 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-xs">
        {communityLinks.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {c.label}
          </a>
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground/70">
        Microverse Protocol © 2026 · 開發者獎金池常駐 · 歡迎查詢合約漏洞
      </p>
    </footer>
  );
}
