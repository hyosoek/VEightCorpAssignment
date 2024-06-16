import { Injectable, NotFoundException } from '@nestjs/common';
import { Qna } from '../entities/qna.entity';
import { AwsService } from 'src/aws/aws.service';
import { BoardsService } from '../boards.service';

@Injectable()
export class QnaService extends BoardsService<Qna> {
  constructor(protected awsService: AwsService) {
    super(awsService);
  }

  getEntityClass() {
    return Qna;
  }
}
