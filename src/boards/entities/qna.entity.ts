import { Entity, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { QnaComment } from 'src/comments/entities/qna-comment.entity';
import { QnaReply } from 'src/reply/entities/qna-reply.entity';
import { repl } from '@nestjs/core';

@Entity() // it means 'create table'
export class Qna extends Board {
  @OneToMany(() => QnaComment, (comment) => comment.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: QnaComment[];

  @OneToMany(() => QnaReply, (reply) => reply.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replys: QnaReply[];
}
