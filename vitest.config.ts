import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Fixed values so URL-building tests don't depend on the local `.env`.
    env: {
      NEXT_PUBLIC_FRONTEND_URL: "https://softwindtech.com",
      NEXT_PUBLIC_BACKEND_URL: "https://api.softwindtech.com/v1",
    },
  },
});
