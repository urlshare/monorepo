import { type Config } from "drizzle-kit";

import { env } from "./src/env";

console.log("DBURL:", env.DATABASE_URL);

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["urlshare_*"],
} satisfies Config;
