import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notice } from '../entities/notice.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule], // use Active Record
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
