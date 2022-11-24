import { Exclude } from 'class-transformer';
// import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EProductStatus } from './product-status.enum';
import { IQuantity } from './type/products.type';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column('jsonb', { nullable: true })
  category: { id: string; name: string };

  @Column('jsonb', { nullable: true })
  quantity: IQuantity[];

  @Column()
  price: number;

  @Column()
  status: EProductStatus;

  @Column()
  brand: string;

  @Column({ nullable: false, type: 'int', default: 0 })
  discount: number;

  @Column()
  viewCount: number;

  @Column('jsonb', { nullable: true })
  nameUrlImage: string[];

  //   @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  //   @Exclude({ toPlainOnly: true })
  //   user: User;
}
