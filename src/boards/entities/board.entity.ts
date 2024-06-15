import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity() // it means 'create table'
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ length: 1000 })
  description: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  availabe: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.boards, { eager: false })
  user: User;

  static async findAll() {
    // usually, doesn't exist built in function is declared
    return this.createQueryBuilder('user').getMany();
  }
}
