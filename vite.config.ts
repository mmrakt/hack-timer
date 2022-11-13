import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Zone",
  version: "0.0.1",
  description: "discription",
  action: {
    default_popup: "index.html",
  },
  background: {
    service_worker: "src/background/main.ts",
    type: "module",
  },
  permissions: ["storage"],
  commands: {
    toggle_timer_status: {
      suggested_key: {
        default: "Ctrl+Shift+1",
      },
      description: "toggle timer status",
    },
  },
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
