import { CreateProtducDto } from './dto/create-product.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { Products } from './product.entity';
import { EProductStatus } from './product-status.enum';
import { Paging } from './type/products.type';
import { GetProductDto } from './dto/get-product.dto';
import { formatPaging } from 'src/utils/formatter';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async getProducts(queryData: GetProductDto): Promise<Paging<Products>> {
    const { page, size, sort, orderBy, start, end, colorId, categoryId, name } =
      queryData;

    const paging = formatPaging(page, size, sort);
    const queryBuilder = this.productsRepository
      .createQueryBuilder('products')
      .orderBy(`products.${orderBy || 'id'}`, sort)
      .skip((Number(page) - 1) * size)
      .take(size);

    if (orderBy === 'price' && start && end) {
      queryBuilder
        .where('products.price >= :start', { start })
        .andWhere('products.price <= :end', { end });
    }
    if (colorId) {
      queryBuilder.where('products.quantity ::jsonb @> :quantity', {
        quantity: JSON.stringify([{ colorId }]),
      });
    }
    if (categoryId) {
      queryBuilder.where('products.category ::jsonb @> :category', {
        category: {
          id: categoryId,
        },
      });
    }
    if (name) {
      queryBuilder.where('products.name like :name', { name: `%${name}%` });
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      content: products,
      pageable: {
        total,
        ...paging.pageable,
      },
    };
  }

  // async getProducts(): Promise<Products[]> {
  //   const query = this.productsRepository.createQueryBuilder('products');

  //   const products = await query.getMany();
  //   return products;
  // }

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async createProduct(createProductDto: CreateProtducDto): Promise<Products> {
    try {
      const task = await this.productsRepository.save({
        ...createProductDto,
        status: EProductStatus.INSTOCK,
      });
      return task;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productsRepository.delete({ id });

    // success is affected === 1, fail is affected === 0
    if (!result.affected) {
      throw new NotFoundException(`File "${id}" not found`);
    }
    throw new HttpException('Delete product successful', HttpStatus.OK);
  }

  async updateProduct(id: string, product: Products): Promise<Products> {
    this.getProductById(id);
    const productUpdated = await this.productsRepository.save(product);
    return productUpdated;
  }
}
