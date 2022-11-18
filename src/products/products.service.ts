import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { errorCodeDBMessageException } from 'src/helpers/errorDBMessage';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      /*  if (!createProductDto.slug) {
        createProductDto.slug = createProductDto.title
          .toLowerCase()
          .replaceAll(' ', '_');
      } */
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }

  async findAllProduct() {
    try {
      const products = this.productRepository.find();
      return products;
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update() {
    try {
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }

  async deleteById(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }
}
