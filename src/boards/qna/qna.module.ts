import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notice } from '../entities/notice.entity';
import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule], // use Active Record
  controllers: [QnaController],
  providers: [QnaService],
})
export class QnaModule {}
