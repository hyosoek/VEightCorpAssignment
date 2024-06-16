import { Controller } from '@nestjs/common';
import { Notice } from '../entities/notice.entity';
import { BoardsController } from '../boards.controller';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController extends BoardsController<Notice> {
  constructor(private readonly noticeService: NoticeService) {
    super(noticeService);
  }
}
