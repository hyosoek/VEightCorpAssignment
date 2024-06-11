import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { Account } from 'src/auth/account.entity';

@Injectable()
export class BoardsService {
  constructor() {
    // private boardRepository: Repository<Board>, // private declare = make property // @InjectRep0?: { where: { account: Account; }; }p0: { where: { account: Account; }; }pository(Board)
    //don't need to declare Repository, because We don't use Repository
  }

  async getAllBoards(): Promise<Board[]> {
    return await Board.find();
  }

  async getBoardByAccount(account: Account): Promise<Board[]> {
    // const found = await Board.find({ where: { account: account } });
    // if I can use built-in method, it is better
    const query = Board.createQueryBuilder('board');
    query.where('board.accountId = :accountId', { accountId: account.id });

    const boards = await query.getMany();

    if (!boards) {
      throw new NotFoundException(
        `Can't find Board with username :  ${account.username}`,
      );
    }
    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    account: Account,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = Board.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      account,
    });
    await Board.save(board);

    return board; //return what we create
  }

  async deleteBoardByID(id: number, account: Account): Promise<void> {
    // we can use remove
    const result = await Board.delete({ id, account }); // if single data, delete pk
    // const board = Board.delete({id:id}); // if object data, it like ''where ??=?? AND ??=??'
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id : ${id} `);
    }
    // return result;
  }

  async updateBoardStatus(
    account: Account,
    status: BoardStatus,
  ): Promise<Board[]> {
    const board = await this.getBoardByAccount(account);

    board.forEach((status) => {
      status = status;
    });
    await Board.save(board);

    return board;
  }
}
