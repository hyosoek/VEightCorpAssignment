import { JwtModuleOptions } from '@nestjs/jwt';
import 'dotenv/config';
import * as config from 'config';

const jwtConfig_ = config.get('jwt');
export const jwtDefaultConfig: JwtModuleOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET_KEY || jwtConfig_.secret,
  signOptions: {
    expiresIn:
      Number(process.env.ACCESS_TOKEN_EXPIRE_TIME) || jwtConfig_.expiresIn,
  },
};
