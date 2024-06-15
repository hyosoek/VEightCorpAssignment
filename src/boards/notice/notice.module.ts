import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notice } from '../entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule], // use Active Record
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
