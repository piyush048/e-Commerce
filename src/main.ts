import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { packageName } from './constants/grpc.constants';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // gRPC microservice setup
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: packageName,
      protoPath: join(__dirname, './proto/product.proto'),
      url: process.env.GRPC_SERVER_URL
    },
  });
  
  await app.startAllMicroservices();
  // await app.listen(process.env.HTTP_PORT ||3001);
}
bootstrap();
