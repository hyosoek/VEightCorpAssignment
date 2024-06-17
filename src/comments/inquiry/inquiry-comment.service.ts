import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { InquiryComment } from '../entities/inquiry-comment.entity';
import { Inquiry } from 'src/boards/entities/inquiry.entity';
import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class InquiryCommentService extends CommentsService<InquiryComment> {
  constructor() {
    super();
  }

  getEntityClass() {
    return InquiryComment;
  }

  getBoardEntityClass() {
    return Inquiry;
  }

  async getTotalPageCount(boardId: number, user: User): Promise<number> {
    await this.checkAuthorization(boardId, user);
    return super.getTotalPageCount(boardId, user);
  }

  async getCommentsByPageNum(boardId: number, currentPage: number, user: User) {
    //게시글 작성자이거나, 관리자인 경우
    await this.checkAuthorization(boardId, user);
    return super.getCommentsByPageNum(boardId, currentPage, user);
  }

  async createComment(
    // 게시글글 작성자이거나, 관리자인 경우
    createCommentDto: CreateCommentDto,
    boardId: number,
    user: User,
  ): Promise<void> {
    await this.checkAuthorization(boardId, user);
    return super.createComment(createCommentDto, boardId, user);
  }
  // update // 게시글 작성자인 경우만 가능
  // delete // 게시글 작성자이거나, 관리자인 경우

  async checkAuthorization(boardId: number, user: User): Promise<void> {
    //권한체크를 쪼갤까 (solid 원칙)
    const options: any = { where: { id: boardId } };
    options.relations = ['user'];
    const inquiry = await Inquiry.findOne(options);
    if (!inquiry) {
      throw new NotFoundException(`invalid boardId`);
    }
    if (user.isAdmin == false && user.id != inquiry.user.id) {
      // 관리자가 아니고, 게시글의 주인이 아닌 경우
      throw new UnauthorizedException(
        `you don't have authority to watch inquiry`,
      );
    }
  }
}
