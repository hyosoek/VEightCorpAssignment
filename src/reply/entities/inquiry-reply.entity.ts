import { Entity, ManyToOne } from 'typeorm';
import { Reply } from './reply.entity';
import { InquiryComment } from 'src/comments/entities/inquiry-comment.entity';

@Entity() // it means 'create table'
export class InquiryReply extends Reply {
  @ManyToOne(() => InquiryComment, (comment) => comment.replys, {
    eager: false,
  })
  comment: InquiryComment;
}
