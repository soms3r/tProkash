import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as path from "path";
import { getClient } from "../client";

export interface MigrateOptions {
  migrationsFolder?: string;
  migrationsTable?: string;
}

export interface MigrationResult {
  success: boolean;
  migrationsTable: string;
  error?: string;
}

export async function runMigrations(options?: MigrateOptions): Promise<MigrationResult> {
  const db = getClient();
  if (!db) {
    return { success: false, migrationsTable: "__drizzle_migrations", error: "Database client not initialized" };
  }

  const migrationsFolder = options?.migrationsFolder ?? path.resolve(__dirname, "..", "..", "migrations");
  const migrationsTable = options?.migrationsTable ?? "__drizzle_migrations";

  try {
    await migrate(db, { migrationsFolder, migrationsTable });
    return { success: true, migrationsTable };
  } catch (error) {
    return {
      success: false,
      migrationsTable,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
