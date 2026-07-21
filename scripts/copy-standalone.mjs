// 将静态资源与 public 目录复制进 Next.js standalone 输出，
// 使 .next/standalone 成为可直接被 nginx 反代 / 直接 node server.js 运行的完整产物。
// 使用 Node 内置 fs，跨平台（不依赖 shell 的 cp 命令）。
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standalone = join(root, ".next", "standalone");
const buildStatic = join(root, ".next", "static");
const buildPublic = join(root, "public");

function copyIfExists(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`[copy-standalone] ${src} -> ${dest}`);
}

copyIfExists(buildStatic, join(standalone, ".next", "static"));
copyIfExists(buildPublic, join(standalone, "public"));
console.log("[copy-standalone] done");
