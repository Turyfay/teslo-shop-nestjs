import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  ParseUUIDPipe,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  getAllProduct(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAllProduct(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Delete(':id')
  deleteByIdProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteById(id);
  }
}
