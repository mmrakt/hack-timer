import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Zone",
  version: "0.0.1",
  description: "discription",
  action: {
    default_icon: "./assets/icon-512.png",
    default_popup: "./dist/popup/index.html",
  },
  // background: {
  //   service_worker: "./dist/background/index.html",
  // },
  permissions: ["tabs", "storage", "activeTab", "http://*/", "https://*/"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["./dist/contentScripts/index.global.js"],
    },
  ],
});

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
