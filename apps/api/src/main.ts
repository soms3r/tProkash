import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  loadEnvironment,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
} from "@tprokash/config";
import { createClient, closeClient } from "@tprokash/database";
import { AppModule } from "./app.module";

async function bootstrap() {
  const env = loadEnvironment();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(env.API_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  if (env.DATABASE_URL) {
    await createClient(env.DATABASE_URL);
  }

  const shutdown = async () => {
    await closeClient();
    await app.close();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  await app.listen(env.PORT);
}
bootstrap();
