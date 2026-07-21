# Microverse Protocol — Clone Scaffold

Next.js 15 (App Router) + Turbopack + Tailwind CSS v4 + shadcn 风格 token + next/font + lucide + 轻量 i18n。

## 技术栈
- **Next.js 15** App Router，开发用 `--turbopack`
- **React 19**
- **Tailwind CSS v4**（`@theme` 定义品牌 token：主色 `#c3ff01`、背景 `#131b25`、圆角 `1rem`）
- **玻璃拟态** `.glass` 工具类（backdrop-blur + 半透明描边）
- **字体**：`next/font` 引入 Geist / Geist Mono / Unbounded（`font-display`）
- **图标**：`lucide-react`
- **i18n**：`components/language-provider.tsx`（默认 `zh-Hant`，localStorage 持久化，繁/EN 切换）
- **部署**：`output: "standalone"` + nginx 反代（见 `nginx.conf`）

## 目录结构
```
app/
  layout.tsx        # 字体/暗色/max-w-md 容器 + 共享 GlassNav/SiteFooter
  page.tsx          # 首页仪表盘（Hero/公告/链路口订单/等级收益/节点邀请）
  globals.css       # Tailwind v4 + @theme token + .glass
  icon.svg          # favicon
  announcements|chains|donate|earnings|node|team/page.tsx  # 路由占位
components/
  glass-nav.tsx     # sticky 玻璃顶栏 + 连接钱包(占位) + 语言切换
  site-footer.tsx   # 审计/开源/知识库 + 版权
  language-provider.tsx
  ui/glass-card.tsx
nginx.conf          # 反代 + SSL + 静态长缓存
```

## 本地运行
```bash
npm install
npm run dev          # http://localhost:3000
```

## 生产构建与部署
```bash
npm run build
npm run start        # 默认 3000 端口
```
- 服务器：Ubuntu + nginx 1.28.x；用 `next start` 或 standalone 产物跑 Node 服务，systemd 守护。
- 反代与 HTTPS 配置见 `nginx.conf`（certbot 签发 Let's Encrypt 证书）。

## 下一步可扩展
- **钱包**：把 `glass-nav.tsx` 里的 `connectWallet` 占位换成 `wagmi` + `viem` 的 `useConnect`。
- **合约数据**：用 `viem` 读取链上收益/节点状态，替换首页占位文案。
- **i18n 完整化**：在 `language-provider.tsx` 的 `dict` 中补充全部业务文案。
- **社区外链**：在 `site-footer.tsx` / 关于页接入 Telegram / X / Medium / DeBox / Linktree / Gamma。
- **分析**：如需数据，接入自托管 Umami（保持隐私友好，区别于第三方 SaaS）。
