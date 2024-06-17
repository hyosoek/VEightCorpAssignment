import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Inquiry } from 'src/boards/entities/inquiry.entity';
import { InquiryReply } from 'src/reply/entities/inquiry-reply.entity';

@Entity() // it means 'create table'
export class InquiryComment extends Comment {
  @ManyToOne(() => Inquiry, (board) => board.comments)
  board: Inquiry;

  @OneToMany((type) => InquiryReply, (reply) => reply.comment, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  replys: InquiryReply[];
}
