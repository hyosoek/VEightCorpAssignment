import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

//
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  // constructor(private readonly authService: AuthService) {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromExtractors([
  //       (request: Request) => {
  //         // return request?.cookies?.Refresh;
  //       },
  //     ]),
  //     secretOrKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  //     passReqToCallback: true,
  //   });
  // }
  // async validate(request: Request, payload: TokenPayload) {
  //   const refreshToken = request.cookies?.Refresh;
  //   return this.authService.getUserIfRefreshTokenMatches(
  //     refreshToken,
  //     payload.userId,
  //   );
  // }
}
