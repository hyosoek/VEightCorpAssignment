import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Inquiry } from '../entities/inquiry.entity';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
@UseGuards(AuthGuard())
export class InquiryController {
  private logger = new Logger('InquiryController');

  constructor(private inquiryService: InquiryService) {}

  //   @Get('/owned')
  //   getInquiriesByUser(@GetUser() user: User): Promise<Inquiry[]> {
  //     this.logger.verbose(`User ${user.username} trying to get all inquiries`);
  //     return this.inquiryService.getInquiriesByUser(user);
  //   }
}
