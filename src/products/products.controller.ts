import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  getAllProduct() {
    return this.productsService.findAllProduct();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  deleteByIdProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteById(id);
  }
}
