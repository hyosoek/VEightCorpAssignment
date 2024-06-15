import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { NotFoundException } from '@nestjs/common';

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
  available: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.boards, { eager: false })
  user: User;

  static async findAll() {
    return this.createQueryBuilder('user').getMany();
  }

  static async findDataById(id: number): Promise<Board> {
    const boardData: Board = await this.findOne({
      where: { id: id },
      select: [
        'id',
        'title',
        'description',
        'views',
        'imageUrl',
        'createdAt',
        'available',
      ],
    });
    return boardData;
  }
}
