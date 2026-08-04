import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserToken } from '../../infrastructures/databases/interfaces/user-token.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Promise<IUserToken> => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);