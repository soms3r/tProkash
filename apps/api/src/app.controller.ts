import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { sql } from "drizzle-orm";
import type { Database } from "@tprokash/database";
import { APP_NAME, APP_VERSION } from "@tprokash/config";
import { DATABASE_CLIENT } from "./database/database.constants";

@ApiTags("System")
@Controller()
export class AppController {
  constructor(
    @Inject(DATABASE_CLIENT) private readonly db: Database | null,
  ) {}

  @Get("/health")
  @ApiOperation({ summary: "Health check" })
  async getHealth(): Promise<{
    status: string;
    version: string;
    uptime: number;
    environment: string;
    database: { connected: boolean; latencyMs?: number; error?: string };
  }> {
    const dbHealth: { connected: boolean; latencyMs?: number; error?: string } = { connected: false };
    if (this.db) {
      const start = Date.now();
      try {
        await this.db.execute(sql`SELECT 1`);
        dbHealth.connected = true;
        dbHealth.latencyMs = Date.now() - start;
      } catch (error) {
        dbHealth.error = error instanceof Error ? error.message : "Unknown error";
      }
    }
    return {
      status: "ok",
      version: APP_VERSION,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: dbHealth,
    };
  }

  @Get("/version")
  @ApiOperation({ summary: "Get version" })
  getVersion(): { name: string; version: string } {
    return { name: APP_NAME, version: APP_VERSION };
  }
}
