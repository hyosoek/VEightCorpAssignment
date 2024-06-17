import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 500)
  description: string;

  @IsNumber()
  boardId: number;
}
