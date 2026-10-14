import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // tests/setup.ts e lib/db.ts leem process.env; copia .env.test.local pra lá.
  const fileEnv = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(fileEnv)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
      // Arquivos de teste compartilham o schema dashboard_test; rodar em série evita TRUNCATE concorrente.
      fileParallelism: false,
      exclude: [...configDefaults.exclude, ".worktrees/**"],
    },
    resolve: { alias: { "@": __dirname } },
  };
});
