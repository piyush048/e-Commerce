import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { status } from '@grpc/grpc-js';
import { 
  CreateProductRequest,
  UpdateProductRequest,
  ProductID,
  ProductFilter,
  ProductResponse,
  ProductListResponse
} from '../proto/product';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    console.log("Product Requested for creation");
    const product = await this.productService.createProduct(data);
    console.log("Product created", product);
    return this.productService.mapToResponse(product);
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(data: UpdateProductRequest): Promise<ProductResponse> {
    console.log("Upadte Request");
    const product = await this.productService.updateProduct(data);
    return this.productService.mapToResponse(product);
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: ProductID): Promise<ProductResponse> {
    const product = await this.productService.getProduct(data.id);
    if (!product) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Product not found'
      });
    }
    return this.productService.mapToResponse(product);
  }

  @GrpcMethod('ProductService', 'ListProducts')
  async listProducts(filter: ProductFilter): Promise<ProductListResponse> {
    const result = await this.productService.listProducts(filter);
    return {
      products: result.products,
      total: result.total,
      page: result.page || 1,
      pageSize: result.pageSize || 10
    };
  }
}