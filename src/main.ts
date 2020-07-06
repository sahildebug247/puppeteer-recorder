import { NestFactory } from '@nestjs/core';
import Helmet from 'helmet';
import { AppModule } from './app/modules/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.use(Helmet());

  app.enableCors();

  // app.use(
  //     RateLimit({
  //       windowMs: 15 * 60 * 1000, // 15 minutes
  //       max: 100, // limit each IP to 100 requests per windowMs
  //     }),
  // );
  const port = process.env.PORT || 3002;
  await app.listen(port);
}

bootstrap();
