import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from './account.entity';
import 'dotenv/config';

@Injectable()
export class JwtStarategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //get token from header
    });
  }
  async validate(payload) {
    const { username } = payload;
    const user: Account = await Account.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
