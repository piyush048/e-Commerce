import { Injectable } from '@nestjs/common';
import { Product } from './schema/product.schema';
import { productDao } from './dao/product.dao';
import { 
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductListResponse
} from '../proto/product';

@Injectable()
export class ProductService {
  constructor( private readonly productDao: productDao ) {}

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.productDao.createProductDao(data);
  }

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    return this.productDao.updateProductDao(data);
  }

  async getProduct(id: string): Promise<Product> {
    return this.productDao.getProductDao(id);
  }

  async listProducts(filter: any): Promise<ProductListResponse> {
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 10;

    const { products, total } = await this.productDao.listProductsDao(filter);

    return {
      products: products.map((product) => this.mapToResponse(product)),
      total,
      page,
      pageSize,
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
