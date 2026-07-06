import { getClient } from "../client";

export interface DatabaseHealth {
  connected: boolean;
  latencyMs?: number;
  error?: string;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const client = getClient();
  if (!client) {
    return { connected: false };
  }

  const start = Date.now();
  try {
    await client.execute("SELECT 1");
    return { connected: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
