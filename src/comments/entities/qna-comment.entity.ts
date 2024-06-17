import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Qna } from 'src/boards/entities/qna.entity';
import { QnaReply } from 'src/reply/entities/qna-reply.entity';

@Entity() // it means 'create table'
export class QnaComment extends Comment {
  @ManyToOne(() => Qna, (board) => board.comments, { eager: false })
  board: Qna;

  @OneToMany((type) => QnaReply, (reply) => reply.comment, { eager: true })
  replys: QnaReply[];
}
