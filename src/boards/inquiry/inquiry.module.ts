import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { AwsModule } from 'src/aws/aws.module';
import { Inquiry } from '../entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), AuthModule, AwsModule], // use Active Record
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
