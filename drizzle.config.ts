import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  strict: false,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [
    "users",
    "sessions",
    "pcs",
    "client_pcs"
  ],
});

