import { IsNotEmpty } from 'class-validator';
import { BoardStatus } from '../board-status.enum';

export class CreateBoardDto {
  @IsNotEmpty() // handler level
  title: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateBoardDto {
  status: BoardStatus;
}

// Dto is Validated by Pipe, so we should use Decorator
// But Make decorator is so hard, we will use class-validator(already made) or with overriding it.
