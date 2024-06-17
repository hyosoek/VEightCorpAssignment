import { Entity, ManyToOne } from 'typeorm';
import { Reply } from './reply.entity';
import { InquiryComment } from 'src/comments/entities/inquiry-comment.entity';
import { Inquiry } from 'src/boards/entities/inquiry.entity';

@Entity() // it means 'create table'
export class InquiryReply extends Reply {
  @ManyToOne(() => InquiryComment, (comment) => comment.replys)
  comment: InquiryComment;

  @ManyToOne(() => Inquiry, (board) => board.replys)
  board: Inquiry;
}
