import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { QnaComment } from '../entities/qna-comment.entity';
import { QnaCommentService } from './qna-comment.service';
import { QnaCommentController } from './qna-comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QnaComment]), AuthModule], // use Active Record
  controllers: [QnaCommentController],
  providers: [QnaCommentService],
})
export class QnaCommentModule {}
