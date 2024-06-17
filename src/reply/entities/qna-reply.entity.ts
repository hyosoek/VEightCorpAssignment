import { Entity, ManyToOne } from 'typeorm';
import { Reply } from './reply.entity';
import { QnaComment } from 'src/comments/entities/qna-comment.entity';
import { Qna } from 'src/boards/entities/qna.entity';

@Entity() // it means 'create table'
export class QnaReply extends Reply {
  @ManyToOne(() => QnaComment, (comment) => comment.replys)
  comment: QnaComment;

  @ManyToOne(() => Qna, (board) => board.replys)
  board: Qna;
}
