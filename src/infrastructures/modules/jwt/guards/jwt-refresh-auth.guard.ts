import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthTypeEnum } from '../../../../infrastructures/modules/jwt/enums/jwt-type.enum';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(
    JwtAuthTypeEnum.RefreshToken,
) { }
