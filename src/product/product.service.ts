import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { Variant } from './schema/variant.schema';
import { 
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductListResponse
} from '../proto/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Variant.name) private variantModel: Model<Variant> 
  ) {}

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const newProduct = new this.productModel(data);

    const variants = await Promise.all(
      data.variants.map(v => 
        this.variantModel.create({
          ...v,
          productId: newProduct._id
        })
      )
    );

    newProduct.variants = variants;
    newProduct.totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    return newProduct.save();
  }

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      data.id,
      data,
      { new: true }
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    if(data.variants && data.variants.length > 0) {
      await this.variantModel.deleteMany({ productId: data.id });

      const variants = await Promise.all(
        data.variants.map(v => 
          this.variantModel.create({
            ...v,
            productId: updatedProduct._id
          })
        )
      )

      updatedProduct.totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
      await updatedProduct.save();
    }

    
    console.log("Updated Product");
    return updatedProduct;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id)
      .populate('variants')
      .lean()
      .exec();
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async listProducts(filter: any): Promise<ProductListResponse> {
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 10;

    const query: any = {};
    if (filter.categoryName) {
      query.categoryName = { $regex: new RegExp(filter.categoryName, 'i') };
    }
    if(filter.brand) {
      query.brand = { $regex: new RegExp(filter.brand, 'i') };
    }

    const [products, total] = await Promise.all([
      this.productModel.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('variants')
        .lean()
        .exec(),
      this.productModel.countDocuments(query).exec()
    ]);

    return {
        products: products.map(product => this.mapToResponse(product)),
        total,
        page,
        pageSize: pageSize
    };
  }

  mapToResponse(product: any): ProductResponse {
    return {
      id: product._id.toString(),
      name: product.name,
      categoryName: product.categoryName,
      brand: product.brand,
      imageUrl: product.imageUrl,
      description: product.description,
      price: product.price,
      totalStock: product.totalStock,
      variants: (product.variants || []).map(v => ({
        id: v._id.toString(),
        size: v.size,
        color: v.color,
        stock: v.stock
      }))
    };
  }
}
