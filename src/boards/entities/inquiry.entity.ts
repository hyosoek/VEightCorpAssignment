import { Entity, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { InquiryComment } from 'src/comments/entities/inquiry-comment.entity';
import { InquiryReply } from 'src/reply/entities/inquiry-reply.entity';

@Entity() // it means 'create table'
export class Inquiry extends Board {
  @OneToMany(() => InquiryComment, (comment) => comment.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: InquiryComment[];

  @OneToMany(() => InquiryReply, (reply) => reply.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replys: InquiryReply[];
}
