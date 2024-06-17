import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/auth/user.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Reply } from './entities/reply.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export abstract class ReplysService<T extends Reply> {
  abstract getEntityClass(): typeof Reply;
  abstract getBoardEntityClass(): typeof Board;
  abstract getCommentEntityClass(): typeof Comment;

  entityClass = this.getEntityClass();
  entityBoardClass = this.getBoardEntityClass();
  entityCommentClass = this.getCommentEntityClass();

  async createReply(
    createReplyDto: CreateReplyDto,
    commentId: number,
    boardId: number,
    user: User,
  ): Promise<void> {
    const board = await this.entityBoardClass.findOne({
      where: { id: boardId },
    });
    const comment = await this.entityCommentClass.findOne({
      where: { id: commentId },
    });
    await this.entityClass.createReply(createReplyDto, user, board, comment);
  }

  async updateReplyById(
    updateReplyDto: CreateReplyDto,
    replyId: number,
    user: User,
  ): Promise<void> {
    const { description } = updateReplyDto;
    const options: any = { where: { id: replyId } };
    options.relations = ['user'];
    const reply = await this.entityClass.findOne(options);
    if (!reply) {
      throw new NotFoundException(`invalid commentId`);
    }
    if (user.id != reply.user.id) {
      // 게시글의 주인이 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to update comment`,
      );
    }
    reply.description = description;
    reply.save();
  }

  async deleteReplyById(replyId: number, user: User): Promise<void> {
    const options: any = { where: { id: replyId } };
    options.relations = ['user'];
    const reply = await this.entityClass.findOne(options);
    if (!reply) {
      throw new NotFoundException(`invalid commentId`);
    }
    if (user.isAdmin == false && user.id != reply.user.id) {
      // 관리자가 아니고, 게시글의 주인이 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to delete comment`,
      );
    }
    await this.entityClass.softRemove(reply);
  }
}
