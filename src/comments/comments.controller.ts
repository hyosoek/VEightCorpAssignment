import {
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard())
export class CommnetsController<T> {
  constructor(private readonly boardService: any) {}

  @Get('/list') // for pagenation
  getBoardList(
    @Query('boardId', ParseIntPipe) boardId: number,
    @Query('currentPage', ParseIntPipe) currentPage: number,
  ) {
    return this.boardService.getCommentsByPageNum(boardId, currentPage);
  }

  @Get('/list/total-pagecount') // for pagenation
  async getBoardPageCount(@Query('boardId', ParseIntPipe) boardId: number) {
    const totalPageCount = await this.boardService.getTotalPageCount(boardId);
    return { totalPageCount: totalPageCount };
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.createComment(createCommentDto, user);
  }

  //   @Delete('/')
  //   @UsePipes(ValidationPipe)
  //   deleteBoard(
  //     @Query('id', ParseIntPipe) id: number,
  //     @GetUser() user: User,
  //   ): Promise<void> {
  //     return this.boardService.deleteBoardById(id, user);
  //   }

  //   @Patch('/')
  //   @UsePipes(ValidationPipe)
  //   updateBoard(
  //     @Query('id', ParseIntPipe) id: number,
  //     @Body() updateBoardDto: any,
  //     @GetUser() user: User,
  //   ): Promise<void> {
  //     return this.boardService.updateBoardById(id, file, updateBoardDto, user);
  //   }
}
