import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Qna } from '../entities/qna.entity'; // Qna 엔티티 경로로 변경
import { QnaService } from './qna.service'; // Qna 서비스 경로로 변경

@Controller('qna')
@UseGuards(AuthGuard())
export class QnaController {
  private logger = new Logger('QnaController');
  constructor(private qnaService: QnaService) {}

  @Get('/owned')
  getQnaByUser(@GetUser() user: User): Promise<Qna[]> {
    this.logger.verbose(`User ${user.username} trying to get all QnAs`);
    return this.qnaService.getQnaByUser(user);
  }
}
