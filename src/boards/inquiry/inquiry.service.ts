import { Injectable, NotFoundException } from '@nestjs/common';
import { Inquiry } from '../entities/inquiry.entity';
import { BoardsService } from '../boards.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class InquiryService extends BoardsService<Inquiry> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Inquiry;
  }
}
