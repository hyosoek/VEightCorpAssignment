import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Reply } from 'src/reply/entities/reply.entity';

@Entity() // it means 'create table'
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  description: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.comments)
  user: User;

  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;

  @OneToMany((type) => Reply, (reply) => reply.comment, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  replys: Reply[];

  // static async findDataById(id: number): Promise<Comment> {
  //   const commentData: Comment = await this.findOne({
  //     where: { id: id },
  //     relations: ['user'],
  //     select: ['id', 'description', 'createdAt', 'available', 'user'],
  //   });
  //   return commentData;
  // }

  static async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
    board: Board,
  ) {
    const { description } = createCommentDto;
    const comment = Comment.create({
      description,
      user,
      board,
    });
    await this.save(comment);
  }
}
