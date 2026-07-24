import { DateTimeUtil } from './../../../shared/utils/datetime.util';
import { UserV1Repository } from './../../user/repositories/user-v1.repository';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { HashUtil } from '../../../shared/utils/hash.util';
import { randomUUID } from 'crypto';
import { config } from '../../../config';
import { IUser } from '../../../infrastructures/databases/interfaces/user.interface';
import { UserTokenTypeEnum } from '../../../shared/enums/user-token.enum';
import { UserTokenV1Repository } from '../../user/repositories/user-token-v1.repository';
import { IJwtPayload } from '../../../infrastructures/modules/jwt/interfaces/jwt-payload.interface';
import { IJwtRefreshPayload } from '../../../infrastructures/modules/jwt/interfaces/jwt-refresh-payload.interface';
import { IRegisterResult } from '../shared/interfaces/register-result.interface';
import { ILoginResult } from '../shared/interfaces/login-result.interface';

@Injectable()
export class AuthV1Service {
  constructor(
    private readonly UserV1Repository: UserV1Repository,
    private readonly userTokenV1Repository: UserTokenV1Repository,
    private readonly jwtService: JwtService,
  ) { }

  private readonly JWT_SECRET = config.jwt.secret;
  private readonly JWT_EXPIRES_IN_SECONDS = config.jwt.expiresInSeconds;
  private readonly JWT_REFRESH_TOKEN_SECRET = config.jwt.refreshTokenSecret;
  private readonly JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS =
    config.jwt.refreshTokenExpiresInSeconds;

  private async generateToken(user: IUser): Promise<string> {
    const payload: IJwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_EXPIRES_IN_SECONDS,
      secret: this.JWT_SECRET,
    });
  }

  private async generateRefreshToken(uuid: string): Promise<string> {
    const payload: IJwtRefreshPayload = {
      id: uuid,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      secret: this.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  private async saveRefreshToken(
    user: IUser,
    refreshToken: string,
    refreshTokenUuid: string,
  ): Promise<void> {
    const data = this.userTokenV1Repository.create({
      user,
      token: refreshToken,
      id: refreshTokenUuid,
      expiresAt: DateTimeUtil.addSeconds(
        new Date(),
        this.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      ),
      type: UserTokenTypeEnum.RefreshToken,
    });

    // Save the refresh token to the database
    await this.userTokenV1Repository.save(data);
  }

  async register(name: string, email: string, password: string): Promise<IRegisterResult> {
    const existingUser =
      await this.UserV1Repository.findOneByEmail(email);


    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }

    const hashedPassword =
      await HashUtil.hashBcryptPassword(password);


    if (!name) {
      throw new BadRequestException(
        'Name is required'
      );
    }

    const user =
      this.UserV1Repository.create({
        name,
        email,
        password: hashedPassword,
      });


    await this.UserV1Repository.save(user);

    return { user }
  }

  async login(email: string, password: string): Promise<ILoginResult> {
    const user = await this.UserV1Repository.findOneByEmail(email)

    if (!user) {
      throw new ConflictException(
        'Email doesnt exist',
      );
    }

    const isPasswordValid = await HashUtil.comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshTokenUuid = randomUUID();

    // If authentication is successful, generate a JWT token
    const [token, refreshToken] = await Promise.all([
      this.generateToken(user),
      this.generateRefreshToken(refreshTokenUuid),
    ]);

    // Save the refresh token to the database
    await this.saveRefreshToken(user, refreshToken, refreshTokenUuid);

    return {
      user,
      token: {
        accessToken: token,
        accessTokenExpiresIn: DateTimeUtil.addSeconds(
          new Date(),
          this.JWT_EXPIRES_IN_SECONDS,
        ),
        refreshToken: refreshToken,
        refreshTokenExpiresIn: DateTimeUtil.addSeconds(
          new Date(),
          this.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        ), // 1 day
      },
    };
  }
}