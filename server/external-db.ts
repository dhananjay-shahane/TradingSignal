import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

if (!process.env.EXTERNAL_DATABASE_URL) {
  throw new Error("EXTERNAL_DATABASE_URL must be set");
}

const externalPool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: false,
});

export const externalDb = drizzle(externalPool);
