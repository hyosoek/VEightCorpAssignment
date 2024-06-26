import { IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @Length(4, 100)
  title: string;

  @IsString()
  @Length(1, 1000)
  description: string;
}
