import { Controller } from '@nestjs/common';
import { CommentsController } from '../comments.controller';
import { InquiryComment } from '../entities/inquiry-comment.entity';
import { InquiryCommentService } from './inquiry-comment.service';

@Controller('comment/inquiry')
export class InquiryCommentController extends CommentsController<InquiryComment> {
  constructor(private readonly inquiryCommentService: InquiryCommentService) {
    super(inquiryCommentService);
  }
}
