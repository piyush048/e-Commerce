import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductModule } from './product/product.module';


async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  // gRPC microservice setup
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: join(__dirname, './proto/product.proto'),
      url: '0.0.0.0:5001',
    },
  });

  await app.startAllMicroservices();
  
  await app.listen(3000);
}
bootstrap();
