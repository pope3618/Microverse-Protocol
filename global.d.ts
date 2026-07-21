// 让 TypeScript 识别浏览器钱包扩展注入的 window.ethereum（MetaMask 等注入式钱包）
// 放在根目录，Next.js 会自动纳入 tsconfig 的全局类型。
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on?: (event: string, handler: (...args: unknown[]) => void) => void;
    removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    isMetaMask?: boolean;
    providers?: unknown[];
  };
}
