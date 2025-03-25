import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

export default defineConfig({
  srcDir: "src",
  dev: {
    server: {
      port: 3001
    }
  },
  manifest: {
    permissions: ["activeTab", "scripting", "storage"],
    host_permissions: ["*://*.urlshare.app/*"]
  },
  vite: () => ({
    plugins: [tailwindcss()]
  })
})
