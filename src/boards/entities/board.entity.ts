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
import { CreateBoardDto } from '../dto/create-board.dto';
import { Comment } from 'src/comments/entities/comment.entity';

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

  @OneToMany((type) => Comment, (comment) => comment.board, { eager: false })
  comments: Comment[];

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

  static async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
    imageUrl: string,
  ) {
    const { title, description } = createBoardDto;
    const board = Board.create({
      title,
      description,
      user,
      imageUrl,
    });
    await this.save(board);
  }
}
