import { Injectable } from '@nestjs/common';
import { Notice } from '../entities/notice.entity';
import { AwsService } from 'src/aws/aws.service';
import { BoardsService } from '../boards.service';

@Injectable()
export class NoticeService extends BoardsService<Notice> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Notice;
  }
}
