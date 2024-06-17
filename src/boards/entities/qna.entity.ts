import { Entity, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { QnaComment } from 'src/comments/entities/qna-comment.entity';

@Entity() // it means 'create table'
export class Qna extends Board {
  @OneToMany(() => QnaComment, (comment) => comment.board, { eager: false })
  comments: QnaComment[];
}
