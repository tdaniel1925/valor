import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default {
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;

