import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CreateReplyDto } from '../dto/create-reply.dto';

@Entity() // it means 'create table'
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => User, (user) => user.comments, { eager: true })
  user: User;

  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;

  @ManyToOne((type) => Comment, (comment) => comment.replys)
  comment: Comment;

  // static async findDataById(id: number): Promise<Reply> {
  //   const replyData: Reply = await this.findOne({
  //     where: { id: id },
  //     relations: ['user'],
  //     select: ['id', 'description', 'createdAt', 'available', 'user'],
  //   });
  //   return commentData;
  // }

  static async createReply(
    createCommentDto: CreateReplyDto,
    user: User,
    board: Board,
    comment: Comment,
  ) {
    const { description } = createCommentDto;
    const reply = Reply.create({
      description,
      user,
      board,
      comment,
    });
    await this.save(reply);
  }
}
