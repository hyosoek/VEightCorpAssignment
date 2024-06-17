import { Entity, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { InquiryComment } from 'src/comments/entities/inquiry-comment.entity';

@Entity() // it means 'create table'
export class Inquiry extends Board {
  @OneToMany(() => InquiryComment, (comment) => comment.board, { eager: false })
  comments: InquiryComment[];
}
