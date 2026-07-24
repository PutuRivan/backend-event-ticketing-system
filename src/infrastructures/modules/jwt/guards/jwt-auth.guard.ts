import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthTypeEnum } from '../../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import {
    IS_EXCLUDE_GLOBAL_GUARD_KEY,
    IS_PUBLIC_KEY,
} from '../../../../shared/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtAuthTypeEnum.AccessToken) {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        const isExcludeGlobalGuard = this.reflector.getAllAndOverride<boolean>(
            IS_EXCLUDE_GLOBAL_GUARD_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic || isExcludeGlobalGuard) {
            return true;
        }

        return super.canActivate(context);
    }
}
