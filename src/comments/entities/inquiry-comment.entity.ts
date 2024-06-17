import { Entity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Inquiry } from 'src/boards/entities/inquiry.entity';

@Entity() // it means 'create table'
export class InquiryComment extends Comment {
  @ManyToOne(() => Inquiry, (board) => board.comments, { eager: false })
  board: Inquiry;
}
