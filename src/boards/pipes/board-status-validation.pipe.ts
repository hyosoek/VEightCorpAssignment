//custom pipe
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
export class BoardStatusValidationPipe implements PipeTransform {
  //PipeTransform is for custom Pipe

  //readonly is like const => For Evince

  transform(value: any, metadata: ArgumentMetadata) {
    return true;
  }
}

// get data single

// value afdafasdas - body
// metadata { metatype: [Function: String], type: 'body', data: 'status' }
// - how body insist
