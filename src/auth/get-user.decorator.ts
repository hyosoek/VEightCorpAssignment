import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Account } from './account.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
