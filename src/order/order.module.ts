import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/products/product.entity';
import { ProductModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Products]),
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductsService],
})
export class OrderModule {}
