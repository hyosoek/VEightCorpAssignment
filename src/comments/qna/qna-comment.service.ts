import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { QnaComment } from '../entities/qna-comment.entity';
import { Qna } from 'src/boards/entities/qna.entity';

@Injectable()
export class QnaCommentService extends CommentsService<QnaComment> {
  constructor() {
    super();
  }

  getEntityClass() {
    return QnaComment;
  }

  getBoardEntityClass() {
    return Qna;
  }
}
