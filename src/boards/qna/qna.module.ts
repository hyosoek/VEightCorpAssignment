import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';
import { AwsModule } from 'src/aws/aws.module';
import { Qna } from '../entities/qna.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qna]), AuthModule, AwsModule], // use Active Record
  controllers: [QnaController],
  providers: [QnaService],
})
export class QnaModule {}
