import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://starcitizenbeginner.com",
  // Emit routes as /path/index.html for maximum compatibility with static hosts.
  trailingSlash: "always",
});
