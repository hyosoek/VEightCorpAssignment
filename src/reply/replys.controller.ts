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
import { Reply } from './entities/reply.entity';
import { ReplysService } from './replys.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@UseGuards(AuthGuard())
export class ReplysController<T extends Reply> {
  constructor(private readonly commentService: ReplysService<T>) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  createReply(
    @Body() CreateReplyDto: CreateReplyDto,
    @Query('boardId', ParseIntPipe) boardId: number,
    @Query('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.createReply(
      CreateReplyDto,
      commentId,
      boardId,
      user,
    );
  }

  @Delete('/')
  @UsePipes(ValidationPipe)
  deleteReply(
    @Query('replyId', ParseIntPipe) replyId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.deleteReplyById(replyId, user);
  }

  @Patch('/')
  @UsePipes(ValidationPipe)
  updateReply(
    @Query('replyId', ParseIntPipe) replyId: number,
    @Body() updateCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.commentService.updateReplyById(updateCommentDto, replyId, user);
  }
}
