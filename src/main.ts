import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  VersioningType,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiResponseExtraModels } from './common/dtos/api-response.dto';
import { PlayerWithFormattedSalary } from './modules/players/dtos';

const globalPrefix = 'api';
const defaultVersion = '1';

export function setupGlobalMiddlewares(app: INestApplication) {
  app.enableCors();
  return app
    .setGlobalPrefix(globalPrefix)
    .useGlobalInterceptors(new TransformInterceptor())
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
    })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
}

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('FIFA 2023')
    .setDescription('The FIFA 2023 API documentation')
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [...apiResponseExtraModels, PlayerWithFormattedSalary],
  });
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupGlobalMiddlewares(app);
  setupSwagger(app);
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
  });
}
bootstrap();
