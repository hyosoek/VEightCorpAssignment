import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payload/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await User.findOne({
      where: { username: username },
      select: ['id', 'username', 'isAdmin', 'password'],
    });

    //if valid data.
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };
      //create token
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      });
      //save refresh_token on RDB
      await User.setCurrentRefreshToken(refreshToken, user.id);
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('logIn failed');
    }
  }

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    await User.createUser(authCredentialDto);
  }

  // user service
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await User.findOne({ where: { id: userId } });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
