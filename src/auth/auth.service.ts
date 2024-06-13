import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payload/jwt.payload';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialDto;
    const userData = await User.getUserDataFromSignin(username, password);
    //create token
    const payload: JwtPayload = {
      id: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    //save refresh_token on RDB
    await User.setCurrentRefreshToken(refreshToken, payload.id);
    return { accessToken, refreshToken };
  }

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    await User.createUser(authCredentialDto);
  }

  // user service
  async getAccessTokenIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<string> {
    const user = await User.getCurrentHashedRefreshToken(userId);

    if (refreshToken === user.currentHashedRefreshToken) {
      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };

      //create token
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    } else {
      // if one's valid refresh token, but published before new refresh token renew (this is on database)
      // both token is same person's token, but publish time is different
      User.setCurrentRefreshToken(null, userId);
      // if not on database, it means captured
      throw new UnauthorizedException('invalid authentication, do sign-out');
    }
  }
}
