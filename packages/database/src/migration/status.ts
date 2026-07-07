import * as fs from "fs";
import * as path from "path";
import { getClient } from "../client";

interface JournalEntry {
  idx: number;
  tag: string;
  hash: string;
  when?: number;
  sql: string[];
  breakpoints: boolean;
}

interface Journal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}

export interface AppliedMigration {
  index: number;
  name: string;
  hash: string;
  appliedAt: Date | null;
}

export interface MigrationStatus {
  total: number;
  applied: AppliedMigration[];
  pending: AppliedMigration[];
}

export async function getMigrationStatus(migrationsFolder?: string): Promise<MigrationStatus> {
  const folder = migrationsFolder ?? path.resolve(process.cwd(), "migrations");
  const journalPath = path.join(folder, "meta", "_journal.json");

  let journal: Journal;
  try {
    journal = JSON.parse(fs.readFileSync(journalPath, "utf-8")) as Journal;
  } catch {
    return { total: 0, applied: [], pending: [] };
  }

  const db = getClient();
  if (!db) {
    return { total: 0, applied: [], pending: [] };
  }

  const appliedHashes: Set<string> = new Set();
  try {
    const rows = (await db.execute(
      `SELECT hash, created_at FROM "__drizzle_migrations" ORDER BY "id" ASC`,
    )) as unknown as { hash: string; created_at: string }[];
    for (const row of rows) {
      appliedHashes.add(row.hash);
    }
  } catch {
    // __drizzle_migrations table doesn't exist yet — no migrations applied
  }

  const applied: AppliedMigration[] = [];
  const pending: AppliedMigration[] = [];

  for (const entry of journal.entries) {
    const info: AppliedMigration = {
      index: entry.idx,
      name: entry.tag,
      hash: entry.hash,
      appliedAt: null,
    };

    if (appliedHashes.has(entry.hash)) {
      applied.push(info);
    } else {
      pending.push(info);
    }
  }

  return { total: journal.entries.length, applied, pending };
}
