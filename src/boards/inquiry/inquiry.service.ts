import { Injectable, NotFoundException } from '@nestjs/common';
import { Inquiry } from '../entities/inquiry.entity';
import { AwsService } from 'src/aws/aws.service';
import { BoardsService } from '../boards.service';

@Injectable()
export class InquiryService extends BoardsService<Inquiry> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Inquiry;
  }
}
