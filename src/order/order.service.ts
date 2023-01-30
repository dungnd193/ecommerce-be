import { EOrderStatus } from './type/order.type';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { Products } from 'src/products/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrderService {
  constructor(
    private productsService: ProductsService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async getOrders(): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order');

    const orders = await query.getMany();
    return orders;
  }

  async getOrderById(id: string): Promise<Order> {
    const task = await this.orderRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    try {
      orderDto.order_list.forEach((order) => {
        this.productsService.getProductById(order.id).then((data) => {
          data.quantity.forEach((d) => {
            if (d.sizeId === order.sizeId && d.colorId === order.colorId) {
              d.quantity -= order.quantity;
              if (d.quantity < 0) {
                throw new BadRequestException(
                  'Vui long kiem tra lai so luong san pham',
                );
              }
            }
          });
          this.productsRepository.save(data);
        });
      });

      const order = this.orderRepository.save(orderDto);
      return order;
    } catch (error) {
      console.error(error);
    }
  }

  async updateOrderStatus(id: string, status: EOrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = status;
    await this.orderRepository.save(order);
    return order;
  }
}
