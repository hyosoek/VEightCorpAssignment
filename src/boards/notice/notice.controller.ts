import {
  Controller,
  Get,
  UseGuards,
  Logger,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Notice } from '../entities/notice.entity';
import { NoticeService } from './notice.service';
import { CreateBoardDto } from '../dto/create-board.dto';

@Controller('notice')
@UseGuards(AuthGuard())
export class NoticeController {
  private logger = new Logger('BoardsController');
  constructor(private noticeService: NoticeService) {}

  //   @Get() // boards/1
  //   getBoardById(): Promise<Notice[]> {
  //     return this.noticeService.getNotice();
  //   }

  //   @Post() // pipetype : built_in_pipe + dto
  //   @UsePipes(ValidationPipe)
  //   createBoard(
  //     @Body() createBoardDto: CreateBoardDto,
  //     @GetUser() user: User,
  //   ): Promise<Notice> {
  //     this.logger.verbose(
  //       `User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`,
  //     );
  //     return this.boardsService.createBoard(createBoardDto, user);
  //   }

  //   @Delete('/:id')
  //   deleteBoard(
  //     @Param('id', ParseIntPipe) id: number,
  //     @GetUser() user: User,
  //   ): Promise<void> {
  //     return this.boardsService.deleteBoardByID(id, user);
  //   }

  //   @Patch('/:id/status') // pipetype : custom_pipe +  variable
  //   updateBoardStatus(
  //     @Param('id', ParseIntPipe) id: number,
  //     @GetUser() user: User,
  //   ): Promise<Board[]> {
  //     return this.boardsService.updateBoardStatus(user);
  //   }
}
