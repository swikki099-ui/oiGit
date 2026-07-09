import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

async function buildServer() {
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  // server deps to bundle to reduce openat(2) syscalls
  const allowlist = [
    "date-fns",
    "express",
    "ws",
    "zod",
    "zod-validation-error",
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

/** Bundle the Vercel serverless function into a single self-contained file.
 *  Vercel does NOT compile TypeScript dependencies outside api/, so we bundle
 *  everything so that /var/task/api/index.js has no unresolved imports. */
async function buildServerless() {
  await esbuild({
    entryPoints: ["api/index.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "api/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    logLevel: "info",
  });
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  await buildServer();

  console.log("building serverless (Vercel)...");
  await buildServerless();
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
