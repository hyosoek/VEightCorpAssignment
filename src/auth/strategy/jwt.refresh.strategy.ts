import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { JwtPayload } from '../payload/jwt.payload';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStarategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //get token from header
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    // only will be used for publish new access token : specialization
    const newAccessToken =
      await this.authService.getAccessTokenIfRefreshTokenMatches(
        refreshToken,
        payload.id,
      );
    return newAccessToken;
  }
}
