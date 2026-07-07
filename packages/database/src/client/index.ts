import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase | null = null;
let pool: postgres.Sql | null = null;

export async function createClient(url: string): Promise<PostgresJsDatabase> {
  if (db) return db;

  pool = postgres(url, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  db = drizzle(pool);

  return db;
}

export function getClient(): PostgresJsDatabase | null {
  return db;
}

export async function closeClient(): Promise<void> {
  if (pool) {
    await pool.end({ timeout: 5 });
    pool = null;
    db = null;
  }
}
