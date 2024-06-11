//custom pipe
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  //PipeTransform is for custom Pipe
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];
  //readonly is like const => For Evince

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't status of board`);
    }
    return value;
  }

  private isStatusValid(status: BoardStatus) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}

// get data single

// value afdafasdas - body
// metadata { metatype: [Function: String], type: 'body', data: 'status' }
// - how body insist
