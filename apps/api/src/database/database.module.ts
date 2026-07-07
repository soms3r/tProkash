import { Global, Module, type OnApplicationShutdown } from "@nestjs/common";
import { loadEnvironment } from "@tprokash/config";
import { createClient, closeClient } from "@tprokash/database";
import { DATABASE_CLIENT } from "./database.constants";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CLIENT,
      useFactory: async () => {
        const env = loadEnvironment();
        if (env.DATABASE_URL) {
          return createClient(env.DATABASE_URL);
        }
        return null;
      },
    },
  ],
  exports: [DATABASE_CLIENT],
})
export class DatabaseModule implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await closeClient();
  }
}
