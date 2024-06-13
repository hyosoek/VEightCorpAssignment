import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user.entity';
import 'dotenv/config';
import { JwtPayload } from '../payload/jwt.payload';

@Injectable()
export class JwtStarategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //get token from header
    });
  }
  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user: User = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // will be used for personal's authentication : universalization
    return user;
  }
}
