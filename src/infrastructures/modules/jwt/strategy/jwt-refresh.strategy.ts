import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAuthTypeEnum } from '../enums/jwt-type.enum';
import { IJwtRefreshPayload } from '../interfaces/jwt-refresh-payload.interface';
import { config } from '../../../../config';
import { IUserToken } from '../../../databases/interfaces/user-token.interface';
import { UserTokenV1Repository } from '../../../../modules/user/repositories/user-token-v1.repository';
import { UserTokenTypeEnum } from '../../../../shared/enums/user-token.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    JwtAuthTypeEnum.RefreshToken,
) {
    constructor(private readonly userTokenV1Repository: UserTokenV1Repository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.refreshTokenSecret,
        });
    }

    async validate(payload: IJwtRefreshPayload): Promise<IUserToken> {
        const { id } = payload;

        const refreshToken =
            await this.userTokenV1Repository.findOneByIdAndTypeWithRelations(
                id,
                UserTokenTypeEnum.RefreshToken,
            );

        if (!refreshToken) {
            throw new UnauthorizedException('Unauthorized');
        }

        // Check if the refresh token is expired
        const isExpired = refreshToken.expiresAt < new Date();
        if (isExpired) {
            throw new UnauthorizedException('Refresh token expired');
        }

        if (!refreshToken.user) {
            throw new UnauthorizedException('User not found');
        }

        return refreshToken;
    }
}
