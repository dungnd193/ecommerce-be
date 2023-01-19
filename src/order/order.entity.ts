import { IOrderItem } from './type/order.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  user_name: string;

  @Column()
  address: string;

  @Column()
  postcode: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  note: string;

  @Column()
  status: string;

  @Column()
  payment_method: string;

  @Column('jsonb', { nullable: true })
  order_list: IOrderItem[];
}
