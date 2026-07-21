import { sepolia } from "wagmi/chains";

// —— 可配置地址（通过 .env.local 覆盖，NEXT_PUBLIC_ 前缀会暴露到前端）——
// 真实部署时把地址写入 .env.local 即可，无需改动业务代码。

// Sepolia 真实测试 USDT（Tether 官方 USDT0，6 位小数）。
// 水龙头：Etherscan 自助 _mint，无需第三方服务，最稳定。
export const USDT_ADDRESS = (process.env.NEXT_PUBLIC_USDT_ADDRESS ??
  "0xc4DCC311c028e341fd8602D8eB89c5de94625927") as `0x${string}`;

// 测试 USDT 自助水龙头入口（Etherscan writeContract 的 _mint）。
export const USDT_FAUCET_URL =
  process.env.NEXT_PUBLIC_USDT_FAUCET_URL ??
  "https://sepolia.etherscan.io/token/0xc4DCC311c028e341fd8602D8eB89c5de94625927#writeContract";

// 收益合约（可选）。配置后收益页读取真实 pending 收益并调用 claim()；
// 留空则走演示逻辑（展示真实链上余额 + 演示可领取额，claim 仍真实上链）。
export const REWARDS_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_ADDRESS
  ? (process.env.NEXT_PUBLIC_REWARDS_ADDRESS as `0x${string}`)
  : null;

// 收益合约最小 ABI：earnings(owner) 视图 + claim() 写入。
export const REWARDS_ABI = [
  {
    type: "function",
    name: "earnings",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

export const SEPOLIA_ID = sepolia.id;

export const etherscanTx = (hash: string) =>
  `https://sepolia.etherscan.io/tx/${hash}`;
