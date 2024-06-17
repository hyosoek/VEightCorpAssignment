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

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => User, (user) => user.boards)
  user: User;

  @OneToMany((type) => Comment, (comment) => comment.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  static async findDataById(id: number): Promise<Board> {
    const boardData: Board = await this.findOne({
      where: { id: id },
      relations: ['user'],
      select: [
        'id',
        'title',
        'description',
        'views',
        'imageUrl',
        'createdAt',
        'user',
      ],
    });
    if (boardData) {
      // user의 id와 username만 남기기
      const { user } = boardData;
      if (user) {
        boardData.user = {
          id: user.id,
          username: user.username,
        } as any;
      }
    }
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
