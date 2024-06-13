import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetToken } from './decorator/get-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data = this.authService.signIn(authCredentialDto);
    return data;
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('/refresh')
  refresh(@GetToken() token: string) {
    //not use service in controller, use service in AuthGuard Strategy
    return token;
  }

  @Post()
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }
}
