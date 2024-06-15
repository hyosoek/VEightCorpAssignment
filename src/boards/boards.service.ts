import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/auth/user.entity';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor() {
    // private boardRepository: Repository<Board>, // private declare = make property // @InjectRep0?: { where: { account: Account; }; }p0: { where: { account: Account; }; }pository(Board)
    //don't need to declare Repository, because We don't use Repository
  }

  async getAllBoards(): Promise<Board[]> {
    return await Board.find();
  }

  async getBoardByUser(user: User): Promise<Board[]> {
    // const found = await Board.find({ where: { account: account } });
    // if I can use built-in method, it is better
    const query = Board.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    if (!boards) {
      throw new NotFoundException(
        `Can't find Board with username :  ${user.username}`,
      );
    }
    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = Board.create({
      title,
      description,
      user,
    });
    await Board.save(board);

    return board; //return what we create
  }

  async deleteBoardByID(id: number, user: User): Promise<void> {
    // we can use remove
    const result = await Board.delete({ id, user }); // if single data, delete pk
    // const board = Board.delete({id:id}); // if object data, it like ''where ??=?? AND ??=??'
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id : ${id} `);
    }
    // return result;
  }

  async updateBoardStatus(user: User): Promise<Board[]> {
    const board = await this.getBoardByUser(user);
    return board;
  }
}
