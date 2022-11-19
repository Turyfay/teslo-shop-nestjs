import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { errorCodeDBMessageException } from 'src/helpers/errorDBMessage';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((images) =>
          this.productImageRepository.create({ url: images }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }

  async findAllProduct(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return products.map((product) => ({
        ...product,
        images: product.images.map((image) => image.url),
      }));
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
      //product = await this.productRepository.findOneBy({ slug: term });
    }
    //const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    }

    return product;
    /* try {
      
     
    } catch (error) {
      errorCodeDBMessageException(error, this.logger);
    } */
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
