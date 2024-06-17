import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommentsController } from '../comments.controller';
import { QnaComment } from '../entities/qna-comment.entity';
import { QnaCommentService } from './qna-comment.service';

@Controller('comment/qna')
export class QnaCommentController extends CommentsController<QnaComment> {
  constructor(private readonly qnaCommentService: QnaCommentService) {
    super(qnaCommentService);
  }
}
