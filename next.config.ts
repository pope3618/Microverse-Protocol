import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 产出 standalone 镜像，便于用 nginx 反代部署（复刻 microvse.com 的部署方式）
  output: "standalone",
  webpack: (config) => {
    // wagmi 的 connectors barrel（wagmi/connectors）会静态引入所有可选连接器
    // （porto / tempo / safe / walletConnect / coinbase / metamask / base …），
    // 它们各自依赖未安装的 peer 包。本项目只用 injected 注入式钱包，因此把
    // 这些可选模块的裸导入别名为 false（空模块），避免 webpack 报 "Module not found"。
    const ignoredOptionalConnectors = [
      "porto",
      "porto/internal",
      "accounts",
      "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider",
      "@walletconnect/ethereum-provider",
      "@coinbase/wallet-sdk",
      "@metamask/connect-evm",
      "@base-org/account",
      "@ledgerhq/connect-kit-loader",
      "@react-native-async-storage/async-storage",
      "@react-native-community/netinfo",
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(ignoredOptionalConnectors.map((m) => [m, false])),
    };
    return config;
  },
};

export default nextConfig;
