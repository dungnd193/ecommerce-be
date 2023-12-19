import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';
import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetSuccessfulOrdersInTimeRangeDto } from './dto/get-successful-orders-in-time-range.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  getOrders(): Promise<Order[]> {
    return this.orderService.getOrders();
  }

  @Get('rangeTime')
  getSuccessfulOrdersInTimeRange(
    @Query() dateRange: GetSuccessfulOrdersInTimeRangeDto
  ): Promise<any[]> {
    const { startDate, endDate, productId } = dateRange;
    return this.orderService.getSuccessfulOrdersInTimeRange(startDate, endDate, productId);
  }
  @Post()
  createOrder(@Body() createColorDto: CreateOrderDto) {
    return this.orderService.createOrder(createColorDto);
  }

  @Put(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;
    return this.orderService.updateOrderStatus(id, status);
  }
}
