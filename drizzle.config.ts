import type { Config } from "drizzle-kit";

export default {
  out: "./databaseMigrations",
  schema: "./database/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  migrations: {
    table: "migrations",
    schema: "./database/migrations",
  },
  dbCredentials: {
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_TOKEN!,
  },
  introspect: {
    casing: "camel",
  },
  verbose: true,
} satisfies Config;
