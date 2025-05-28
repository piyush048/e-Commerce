import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3001);
}
bootstrap();

