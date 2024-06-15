import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { NoticeModule } from './boards/notice/notice.module';
import { InquiryModule } from './boards/inquiry/inquiry.module';
import { QnaModule } from './boards/qna/qna.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardsModule,
    AuthModule,
    NoticeModule,
    InquiryModule,
    QnaModule,
  ],
})
export class AppModule {}
