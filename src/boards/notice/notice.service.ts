import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/auth/user.entity';
import { Notice } from '../entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor() {}

  async getNoticeByUser(user: User): Promise<Notice[]> {
    const query = Notice.createQueryBuilder('notice');
    query.where('notice.userId = :userId', { userId: user.id });

    const notices = await query.getMany();

    if (!notices) {
      throw new NotFoundException(
        `Can't find Board with username :  ${user.username}`,
      );
    }
    return notices;
  }
}
