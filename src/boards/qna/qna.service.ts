import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/auth/user.entity';
import { Qna } from '../entities/qna.entity';

@Injectable()
export class QnaService {
  constructor() {}

  async getQnaByUser(user: User): Promise<Qna[]> {
    const query = Qna.createQueryBuilder('qna');
    query.where('qna.userId = :userId', { userId: user.id });

    const qnas = await query.getMany();

    if (!qnas) {
      throw new NotFoundException(
        `Can't find Board with username :  ${user.username}`,
      );
    }
    return qnas;
  }
}
