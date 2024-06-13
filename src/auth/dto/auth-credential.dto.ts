import { IsString, Length, Matches, Validate } from 'class-validator';
import { CustomValidator } from '../decorator/customValidator.decorator';

export class AuthCredentialDto {
  @Validate(CustomValidator)
  username: string;

  @IsString()
  @Length(4, 20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;
  //both are same validation
}
