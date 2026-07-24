import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthTypeEnum } from '../enums/jwt-type.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UserV1Repository } from '../../../../modules/user/repositories/user-v1.repository';
import { IUser } from '../../../databases/interfaces/user.interface';
import { config } from '../../../../config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    JwtAuthTypeEnum.AccessToken,
) {
    constructor(private readonly userRepository: UserV1Repository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secret,
        });
    }

    async validate(payload: IJwtPayload): Promise<IUser> {
        const { id } = payload;
        const user = await this.userRepository.findOneById(id);

        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}
