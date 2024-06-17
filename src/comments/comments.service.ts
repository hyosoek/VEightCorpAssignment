import { Injectable, NotFoundException } from '@nestjs/common';
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
  ): Promise<Comment[]> {
    const totalPageCount = await this.getTotalPageCount(boardId);
    if (totalPageCount < currentPage) {
      throw new NotFoundException(`over maximum pageCount : ${totalPageCount}`);
    }
    const entityData = await this.entityClass.find({
      where: {
        available: true, // available이 true인 데이터만 가져옴
      },
      order: { createdAt: 'DESC' }, // 최신순으로 정렬
      skip: (currentPage - 1) * Number(process.env.COMMENT_PER_PAGE),
      take: Number(process.env.COMMENT_PER_PAGE),
      select: ['id', 'description', 'user'],
    });
    return entityData;
  }

  async getTotalPageCount(boardId: number): Promise<number> {
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
    createBoardDto: CreateCommentDto,
    user: User,
  ): Promise<void> {
    const { boardId } = createBoardDto;
    const board = await this.entityBoardClass.findOne({
      where: { id: boardId },
    });
    await this.entityClass.createComment(createBoardDto, user, board);
  }
}
