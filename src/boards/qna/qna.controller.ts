import { Controller, UseGuards } from '@nestjs/common';
import { Qna } from '../entities/qna.entity'; // Qna 엔티티 경로로 변경
import { QnaService } from './qna.service'; // Qna 서비스 경로로 변경
import { BoardsController } from '../boards.controller';

@Controller('qna')
export class QnaController extends BoardsController<Qna> {
  constructor(private readonly qnaService: QnaService) {
    super(qnaService);
  }
}
