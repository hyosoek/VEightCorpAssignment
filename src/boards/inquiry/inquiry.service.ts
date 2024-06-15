import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Inquiry } from '../entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor() {}

  //   async getInquiriesByUser(user: User): Promise<Inquiry[]> {
  //     const query = Inquiry.createQueryBuilder('inquiry');
  //     query.where('inquiry.userId = :userId', { userId: user.id });

  //     const inquiries = await query.getMany();

  //     if (!inquiries.length) {
  //       // 빈 배열이라면 NotFoundException을 던짐
  //       throw new NotFoundException(
  //         `Can't find Inquiries with username: ${user.username}`,
  //       );
  //     }
  //     return inquiries;
  //   }
}
