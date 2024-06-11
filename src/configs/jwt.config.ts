import { JwtModuleOptions } from '@nestjs/jwt';
import 'dotenv/config';
import * as config from 'config';

const jwtConfig_ = config.get('jwt');
export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY || jwtConfig_.secret,
  // signOptions: {
  //   expiresIn: Number(process.env.JWT_EXPIRE_TIME) || jwtConfig_.expiresIn,
  // },
};
