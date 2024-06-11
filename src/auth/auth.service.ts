import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Account } from './account.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await Account.findOne({ where: { username: username } });

    //if valid data.
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      //create token
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      });
      //save refresh_token on RDB
      await Account.setCurrentRefreshToken(refreshToken, user.id);
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('logIn failed');
    }
  }

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    await Account.createUser(authCredentialDto);
  }
}
