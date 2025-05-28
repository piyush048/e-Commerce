import { Controller, Get, Post, Body, Param, UseGuards, Inject, Query, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

interface ProductService {
  CreateProduct(data: any): Observable<any>;
  GetProduct(data: { id: string }): Observable<any>;
  DeleteProduct(data: {id: string}): Observable<any>;
  ListProducts(data: any): Observable<any>;
  UpdateProduct(data: any): Observable<any>;
}

@Controller('products')
export class ProductController {
  private productService: ProductService;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  createProduct(@Body() createDto: CreateProductDto) {
    return this.productService.CreateProduct(createDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProduct(@Param('id') id: string) {
    return this.productService.GetProduct({ id });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listProducts(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('categoryName') categoryName: string,
    @Query('brand') brand: string,
  ) {
    return this.productService.ListProducts({
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 10,
      categoryName: categoryName,
      brand: brand,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  updateProduct(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productService.UpdateProduct({ id, ...updateDto });
  }
}
