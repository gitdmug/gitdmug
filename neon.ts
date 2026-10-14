import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  buckets: {
    "gitdm-files": { access: "private" },
    "gitdm-public": { access: "public_read" },
  },
});
