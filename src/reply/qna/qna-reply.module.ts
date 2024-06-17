import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { QnaReply } from '../entities/qna-reply.entity';
import { QnaReplyController } from './qna-reply.controller';
import { QnaReplyService } from './qna-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([QnaReply]), AuthModule],
  controllers: [QnaReplyController],
  providers: [QnaReplyService],
})
export class QnaReplyModule {}
