import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { APP_NAME, APP_VERSION } from "@tprokash/config";

@ApiTags("System")
@Controller()
export class AppController {
  @Get("/health")
  @ApiOperation({ summary: "Health check" })
  getHealth(): {
    status: string;
    version: string;
    uptime: number;
    environment: string;
  } {
    return {
      status: "ok",
      version: APP_VERSION,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    };
  }

  @Get("/version")
  @ApiOperation({ summary: "Get version" })
  getVersion(): { name: string; version: string } {
    return { name: APP_NAME, version: APP_VERSION };
  }
}
