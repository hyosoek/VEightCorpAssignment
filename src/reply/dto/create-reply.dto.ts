import { IsString, Length } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @Length(1, 500)
  description: string;
}
