import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReplysService } from '../replys.service';
import { InquiryReply } from '../entities/inquiry-reply.entity';
import { Inquiry } from 'src/boards/entities/inquiry.entity';
import { InquiryComment } from 'src/comments/entities/inquiry-comment.entity';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class InquiryReplyService extends ReplysService<InquiryReply> {
  constructor() {
    super();
  }

  getEntityClass() {
    return InquiryReply;
  }

  getBoardEntityClass() {
    return Inquiry;
  }

  getCommentEntityClass() {
    return InquiryComment;
  }

  async createReply(
    // 게시글글 작성자이거나, 관리자인 경우
    createReplyDto: CreateReplyDto,
    commentId: number,
    boardId: number,
    user: User,
  ): Promise<void> {
    await this.checkAuthorization(boardId, user);
    return super.createReply(createReplyDto, commentId, boardId, user);
  }

  async checkAuthorization(boardId: number, user: User): Promise<void> {
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
