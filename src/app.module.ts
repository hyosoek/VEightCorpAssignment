import { Module } from '@nestjs/common';
// import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { NoticeModule } from './boards/notice/notice.module';
import { InquiryModule } from './boards/inquiry/inquiry.module';
import { QnaModule } from './boards/qna/qna.module';
import { QnaComment } from './comments/entities/qna-comment.entity';
import { QnaCommentModule } from './comments/qna/qna-comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    NoticeModule,
    InquiryModule,
    QnaModule,
    QnaCommentModule,
  ],
})
export class AppModule {}
