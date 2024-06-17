import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export abstract class CommentsService<T extends Comment> {
  abstract getEntityClass(): typeof Comment;
  abstract getBoardEntityClass(): typeof Board;
  entityClass = this.getEntityClass();
  entityBoardClass = this.getBoardEntityClass();

  async getCommentsByPageNum(
    boardId: number,
    currentPage: number,
    user: User,
  ): Promise<Comment[]> {
    const totalPageCount = await this.getTotalPageCount(boardId, user);
    if (totalPageCount < currentPage) {
      throw new NotFoundException(`over maximum pageCount : ${totalPageCount}`);
    }
    const entityData = await this.entityClass.find({
      where: {
        available: true, // available이 true인 데이터만 가져옴
      },
      relations: ['user'],
      order: { createdAt: 'DESC' }, // 최신순으로 정렬
      skip: (currentPage - 1) * Number(process.env.COMMENT_PER_PAGE),
      take: Number(process.env.COMMENT_PER_PAGE),
      select: ['id', 'description', 'createdAt', 'available', 'user'],
    });
    const filteredData = entityData.map((entity) => {
      const { user, replys } = entity;
      if (user) {
        entity.user = {
          id: user.id,
          username: user.username,
        } as any;
      }
      if (replys) {
        entity.replys = replys.map((reply) => {
          const { user: replyUser } = reply;
          if (replyUser) {
            reply.user = {
              id: replyUser.id,
              username: replyUser.username,
            } as any;
          }
          return reply;
        });
      }
      return entity;
    });

    return filteredData;
  }

  async getTotalPageCount(boardId: number, user: User): Promise<number> {
    const entityData = await this.entityClass.findAndCount({
      relations: ['board'],
      where: { available: true, board: { id: boardId } },
    });
    return this.getTotalPageCountModule(entityData[1]);
  }

  //   private module;
  private getTotalPageCountModule(entityData: number): number {
    const boardPerPage = Number(process.env.COMMENT_PER_PAGE);
    const totalPageCount = Math.floor((entityData - 1) / boardPerPage) + 1;
    return totalPageCount;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    boardId: number,
    user: User,
  ): Promise<void> {
    const board = await this.entityBoardClass.findOne({
      where: { id: boardId },
    });
    await this.entityClass.createComment(createCommentDto, user, board);
  }

  async updateCommentById(
    commentId: number,
    updateCommentDto: CreateCommentDto,
    user: User,
  ): Promise<void> {
    const { description } = updateCommentDto;
    const options: any = { where: { id: commentId } };
    options.relations = ['user'];
    const comment = await this.entityClass.findOne(options);
    if (!comment || comment.available == false) {
      throw new NotFoundException(`invalid commentId`);
    }
    if (user.id != comment.user.id) {
      // 게시글의 주인이 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to update comment`,
      );
    }
    comment.description = description;
    comment.save();
  }

  async deleteCommentById(commentId: number, user: User): Promise<void> {
    const options: any = { where: { id: commentId } };
    options.relations = ['user'];
    const comment = await this.entityClass.findOne(options);
    if (!comment || comment.available == false) {
      throw new NotFoundException(`invalid commentId`);
    }
    if (user.isAdmin == false && user.id != comment.user.id) {
      // 관리자가 아니고, 게시글의 주인이 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to delete comment`,
      );
    }
    comment.available = false;
    comment.save();
  }
}
