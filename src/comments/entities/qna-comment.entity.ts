import { Entity, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Qna } from 'src/boards/entities/qna.entity';

@Entity() // it means 'create table'
export class QnaComment extends Comment {
  @ManyToOne(() => Qna, (board) => board.comments, { eager: false })
  board: Qna;
}
