import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<Categories[]> {
    const query = await this.categoryRepository.createQueryBuilder(
      'categories',
    );

    // query.where({ user });

    // if (status) {
    //   query.where('task.status = :status', { status });
    // }
    // if (search) {
    //   query.andWhere(
    //     '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
    //     { search: `%${search}%` },
    //   );
    // }

    const categories = await query.getMany();
    return categories;
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Categories> {
    try {
      const category = this.categoryRepository.save(categoryDto);

      return category;
    } catch (error) {
      console.error(error);
    }
  }
}
