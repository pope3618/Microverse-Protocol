import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 复刻 dApp 的钱包接入配置：注入式钱包（MetaMask 等）+ 公共 RPC
// 真实项目可在此补充 WalletConnect（需 projectId）与自有链/合约地址
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
