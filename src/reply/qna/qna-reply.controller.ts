import { Controller } from '@nestjs/common';
import { ReplysController } from '../replys.controller';
import { QnaReply } from '../entities/qna-reply.entity';
import { QnaReplyService } from './qna-reply.service';

@Controller('reply/qna')
export class QnaReplyController extends ReplysController<QnaReply> {
  constructor(private readonly qnaReplyService: QnaReplyService) {
    super(qnaReplyService);
  }
}
