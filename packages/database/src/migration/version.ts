import { getClient } from "../client";

export interface DatabaseVersion {
  version: string | null;
  appliedAt: Date | null;
  migrationCount: number;
}

export async function getDatabaseVersion(): Promise<DatabaseVersion> {
  const db = getClient();
  if (!db) {
    return { version: null, appliedAt: null, migrationCount: 0 };
  }

  try {
    const rows = (await db.execute(
      `SELECT "hash", "created_at" FROM "__drizzle_migrations" ORDER BY "id" DESC LIMIT 1`,
    )) as unknown as { hash: string; created_at: string }[];

    const row = rows[0];
    if (!row) {
      return { version: null, appliedAt: null, migrationCount: 0 };
    }

    const { hash, created_at } = row;

    const countRows = (await db.execute(
      `SELECT COUNT(*) as "count" FROM "__drizzle_migrations"`,
    )) as unknown as { count: number }[];

    const countRow = countRows[0];
    const migrationCount = countRow ? Number(countRow.count) : 0;

    return {
      version: hash,
      appliedAt: new Date(created_at),
      migrationCount,
    };
  } catch {
    return { version: null, appliedAt: null, migrationCount: 0 };
  }
}
