import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductConsumer } from './product.grpc.consumer';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';
import { Variant, VariantSchema } from './schema/variant.schema';
import { productDao } from 'src/product/dao/product.dao';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Variant.name, schema: VariantSchema }]),
  ],
  controllers: [ProductConsumer],
  providers: [ProductService,productDao],
})
export class ProductModule {}
