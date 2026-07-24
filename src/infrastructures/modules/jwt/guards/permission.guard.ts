import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../../shared/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
    ) {}


    canActivate(
        context: ExecutionContext,
    ): boolean {

        const roles = this.reflector.get<RoleEnum[]>(
            ROLE_KEY,
            context.getHandler(),
        );


        // endpoint tidak butuh role
        if (!roles) {
            return true;
        }


        const request =
            context.switchToHttp().getRequest();


        const user = request.user;


        if (!user) {
            throw new ForbiddenException(
                'User not authenticated',
            );
        }


        if (!roles.includes(user.role)) {
            throw new ForbiddenException(
                'Insufficient role',
            );
        }


        return true;
    }
}