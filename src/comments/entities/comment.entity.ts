import {
  BaseEntity,
  Column,
  CreateDateColumn,
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

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.comments, { eager: false })
  user: User;

  @ManyToOne((type) => Board, (board) => board.comments, { eager: false })
  board: Board;

  @OneToMany((type) => Reply, (reply) => reply.comment, { eager: true })
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
