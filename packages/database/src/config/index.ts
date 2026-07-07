import { getEnvironment } from "@tprokash/config";

export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  idleTimeout: number;
  connectTimeout: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  const env = getEnvironment();
  return {
    url: env.DATABASE_URL || "",
    maxConnections: 10,
    idleTimeout: 30,
    connectTimeout: 10,
  };
}
