import { Injectable } from '@nestjs/common';
import { ReplysService } from '../replys.service';
import { QnaReply } from '../entities/qna-reply.entity';
import { Qna } from 'src/boards/entities/qna.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { QnaComment } from 'src/comments/entities/qna-comment.entity';

@Injectable()
export class QnaReplyService extends ReplysService<QnaReply> {
  constructor() {
    super();
  }

  getEntityClass() {
    return QnaReply;
  }

  getBoardEntityClass() {
    return Qna;
  }

  getCommentEntityClass() {
    return QnaComment;
  }
}
