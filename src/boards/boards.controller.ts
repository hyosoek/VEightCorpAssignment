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
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardsService: BoardsService) {}

  @Get('/owned') // boards/1
  getBoardById(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardsService.getBoardByUser(user);
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
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoardByID(id, user);
  }

  @Patch('/:id/status') // pipetype : custom_pipe +  variable
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() user: User,
  ): Promise<Board[]> {
    return this.boardsService.updateBoardStatus(user, status);
  }
}
