import {
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard())
export class CommnetsController<T> {
  constructor(private readonly commentService: any) {}

  @Get('/list') // for pagenation
  getCommentList(
    @Query('boardId', ParseIntPipe) boardId: number,
    @Query('currentPage', ParseIntPipe) currentPage: number,
    @GetUser() user: User,
  ): Promise<Comment[]> {
    return this.commentService.getCommentsByPageNum(boardId, currentPage, user);
  }

  @Get('/list/total-pagecount') // for pagenation
  async getCommentPageCount(
    @Query('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
  ) {
    const totalPageCount = await this.commentService.getTotalPageCount(
      boardId,
      user,
    );
    return { totalPageCount: totalPageCount };
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Query('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.createComment(createCommentDto, boardId, user);
  }

  @Delete('/')
  @UsePipes(ValidationPipe)
  deleteComment(
    @Query('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.deleteCommentById(commentId, user);
  }

  @Patch('/')
  @UsePipes(ValidationPipe)
  updateComment(
    @Query('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.updateCommentById(
      commentId,
      updateCommentDto,
      user,
    );
  }
}
