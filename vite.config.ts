import react from "@vitejs/plugin-react";
import * as process from "process";
import { UserConfig, defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig((config: UserConfig) => {
  // 加载环境变量
  const env = loadEnv(config.mode, process.cwd());

  return {
    plugins: [tsconfigPaths(), react(), mkcert()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL || "http://127.0.0.1:12312",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
