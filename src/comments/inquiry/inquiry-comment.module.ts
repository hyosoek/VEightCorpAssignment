import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InquiryComment } from '../entities/inquiry-comment.entity';
import { InquiryCommentService } from './inquiry-comment.service';
import { InquiryCommentController } from './inquiry-comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryComment]), AuthModule], // use Active Record
  controllers: [InquiryCommentController],
  providers: [InquiryCommentService],
})
export class InquiryCommentModule {}
