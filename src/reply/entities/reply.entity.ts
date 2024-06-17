import {
  BaseEntity,
  Column,
  CreateDateColumn,
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

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.comments, { eager: false })
  user: User;

  @ManyToOne((type) => Board, (board) => board.comments, { eager: false })
  board: Board;

  @ManyToOne((type) => Comment, (comment) => comment.replys, { eager: false })
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
