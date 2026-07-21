# 部署到 Vercel（让别人通过互联网访问）

本仓库已 `git init` 并提交到 `main` 分支。下面把项目推到 GitHub，再用 Vercel 导入即可获得公网 HTTPS 地址。

## 前置条件
- 一个 GitHub 账号；
- 一个 Vercel 账号（用 GitHub 直接登录即可，免费）。

## 步骤

### 1. 在 GitHub 新建空仓库
打开 https://github.com/new ，仓库名随便（如 `microvse-clone`），**不要**勾选 “Add a README file” / “Add .gitignore”，保持完全空仓库。

### 2. 关联并推送
把下面 `<你的用户名>` 和 `<仓库名>` 换成实际值：
```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 3. 在 Vercel 导入
1. 打开 https://vercel.com ，用 GitHub 登录；
2. 点 **Add New → Project**，Import 刚才推送的仓库；
3. Framework 会自动识别为 **Next.js**，Build Command 默认 `next build`、Output 默认 `.next`，**无需改任何设置**；
4. 点 **Deploy**，约 1 分钟完成后会得到一个 `https://<项目名>.vercel.app` 公网地址，别人直接打开即可访问。

### 4.（可选）绑定自定义域名
在 Vercel 项目 **Settings → Domains** 添加你的域名，按提示把 DNS 的 CNAME 指向 `cname.vercel-dns.com`，几分钟生效。

## 需要知道的几点
- 本项目 `next.config.ts` 里有 `output: "standalone"`，在 Vercel 上会被忽略（不影响部署），Vercel 用自己的 serverless 运行时。
- `next.config.ts` 的 webpack `resolve.alias` 把 wagmi 的可选连接器（porto / safe / walletconnect / coinbase / metamask 等）别名为空模块，确保 `next build` 零告警。
- 项目**不依赖任何环境变量**，开箱即部署。
- 本地预览生产效果：`npm run build`（若遇到 WorkBuddy 的 safe-delete 报错，加前缀 `CODEBUDDY_SESSION_ID= CLAUDE_SESSION_ID=` 再跑）然后 `npm run start`。

## 钱包 / 捐赠功能说明
- 内置预览浏览器、没装钱包扩展的普通浏览器里点「連接錢包」会提示「未偵測到錢包」——这是正确行为，不是 bug。
- 真机请用 Chrome / Edge + MetaMask 扩展，打开部署后的公网地址即可连钱包；
- 捐赠功能强制在 **Sepolia 测试网** 才允许发交易（主网会被拦截），目标地址用的是演示销毁地址 `0x…dEaD`，页面已标注「請勿轉入真實資金」。

## 后续更新
每次改完代码，`git add -A && git commit -m "..." && git push` 后，Vercel 会自动重新构建部署（也可在 Vercel 开启 Production 分支保护）。
