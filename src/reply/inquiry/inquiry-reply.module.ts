import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InquiryReply } from '../entities/inquiry-reply.entity';
import { InquiryReplyController } from './inquiry-reply.controller';
import { InquiryReplyService } from './inquiry-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryReply]), AuthModule],
  controllers: [InquiryReplyController],
  providers: [InquiryReplyService],
})
export class InquiryReplyModule {}
