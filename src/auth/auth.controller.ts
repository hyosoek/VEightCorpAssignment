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
import { GetUser } from './decorator/get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data = this.authService.signIn(authCredentialDto);
    return data;
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('/refresh')
  refresh(@GetToken() token: string): { accessToken: string } {
    //not use service in controller, use service in AuthGuard Strategy
    return { accessToken: token };
  }

  @UseGuards(AuthGuard())
  @Get('/is-admin')
  async isAdmin(@GetUser() user: User): Promise<{ isAdmin: boolean }> {
    const data = await this.authService.isAdmin(user);
    return { isAdmin: data };
  }

  @Post()
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }
}
