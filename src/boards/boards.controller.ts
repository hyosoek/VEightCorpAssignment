import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Account } from 'src/auth/account.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardsService: BoardsService) {}

  @Get('/owned') // boards/1
  getBoardById(@GetUser() account: Account): Promise<Board[]> {
    this.logger.verbose(`User ${account.username} trying to get all boards`);
    return this.boardsService.getBoardByAccount(account);
  }

  // @Get('/:id') // boards/1
  // getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
  //   return this.boardsService.getBoardByID(id);
  // }

  @Get()
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  // @Get() // boards?id=1
  // getBoardById(@Query('id', ParseIntPipe) id: number): Promise<Board> {
  //   return this.boardsService.getBoardByID(id);
  // }

  @Post() // pipetype : built_in_pipe + dto
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() account: Account,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${account.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`,
    );
    return this.boardsService.createBoard(createBoardDto, account);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() account: Account,
  ): Promise<void> {
    return this.boardsService.deleteBoardByID(id, account);
  }

  @Patch('/:id/status') // pipetype : custom_pipe +  variable
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() account: Account,
  ): Promise<Board[]> {
    return this.boardsService.updateBoardStatus(account, status);
  }
}
