import { Controller } from '@nestjs/common';
import { ReplysController } from '../replys.controller';
import { InquiryReply } from '../entities/inquiry-reply.entity';
import { InquiryReplyService } from './inquiry-reply.service';

@Controller('reply/inquiry')
export class InquiryReplyController extends ReplysController<InquiryReply> {
  constructor(private readonly inquiryReplyService: InquiryReplyService) {
    super(inquiryReplyService);
  }
}
