import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/health")
  getHealth(): { status: string } {
    return { status: "ok" };
  }

  @Get("/version")
  getVersion(): { name: string; version: string } {
    return { name: "tProkash", version: "0.1.0" };
  }
}
