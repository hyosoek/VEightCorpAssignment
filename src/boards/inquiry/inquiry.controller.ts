import { Controller } from '@nestjs/common';
import { Inquiry } from '../entities/inquiry.entity';
import { BoardsController } from '../boards.controller';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
export class InquiryController extends BoardsController<Inquiry> {
  constructor(private readonly inquiryService: InquiryService) {
    super(inquiryService);
  }
}
