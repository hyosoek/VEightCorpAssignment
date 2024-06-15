import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty() // handler level
  title: string;

  @IsNotEmpty()
  description: string;
}
