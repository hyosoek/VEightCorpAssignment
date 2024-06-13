import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetToken = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // token is saved as req.user
  },
);
