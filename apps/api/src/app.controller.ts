import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { APP_NAME, APP_VERSION } from "@tprokash/config";
import { checkDatabaseHealth } from "@tprokash/database";

@ApiTags("System")
@Controller()
export class AppController {
  @Get("/health")
  @ApiOperation({ summary: "Health check" })
  async getHealth(): Promise<{
    status: string;
    version: string;
    uptime: number;
    environment: string;
    database: { connected: boolean; latencyMs?: number; error?: string };
  }> {
    const dbHealth = await checkDatabaseHealth();
    return {
      status: "ok",
      version: APP_VERSION,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: {
        connected: dbHealth.connected,
        latencyMs: dbHealth.latencyMs,
        error: dbHealth.error,
      },
    };
  }

  @Get("/version")
  @ApiOperation({ summary: "Get version" })
  getVersion(): { name: string; version: string } {
    return { name: APP_NAME, version: APP_VERSION };
  }
}
