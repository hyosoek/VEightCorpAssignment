import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notice } from '../entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule, AwsModule], // use Active Record
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
