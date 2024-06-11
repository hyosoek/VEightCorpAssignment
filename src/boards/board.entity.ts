import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Account } from 'src/auth/account.entity';

@Entity() // it means 'create table'
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;

  @ManyToOne((type) => Account, (account) => account.boards, { eager: false })
  account: Account;

  static async findAll() {
    // usually, doesn't exist built in function is declared
    return this.createQueryBuilder('user').getMany();
  }
}
