import { EOrderStatus } from './type/order.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
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
