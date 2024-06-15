import {
  Controller,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { NoticeService } from './notice.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('notice')
@UseGuards(AuthGuard())
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  //   @Get() // boards/1
  //   getBoardById(): Promise<Notice[]> {
  //     return this.noticeService.getNotice();
  //   }

  @Post() // pipetype : built_in_pipe + dto
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.noticeService.createNotice(file, createBoardDto, user);
  }

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
