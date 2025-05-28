import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';
import { Variant, VariantSchema } from './schema/variant.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/eCommerce'),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Variant.name, schema: VariantSchema }])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
