import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../user.entity';

export const GetToken = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.token;
  },
);
