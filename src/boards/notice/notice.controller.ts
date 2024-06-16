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
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { NoticeService } from './notice.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Notice } from '../entities/notice.entity';

@Controller('notice')
@UseGuards(AuthGuard())
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  // @Get('/list')
  // getBoardList(): Promise<Notice[]> {
  //   return this.noticeService.getNotice();
  // }
  @Get()
  getBoardById(@Query('id', ParseIntPipe) id: number): Promise<Notice> {
    return this.noticeService.getNoticeById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.noticeService.createNotice(file, createBoardDto, user);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  deleteBoard(
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.noticeService.deleteNoticeById(id, user);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  updateBoard(
    @Query('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.noticeService.updateNoticeById(id, file, updateBoardDto, user);
  }
}
