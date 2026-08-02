import { UserV1Response } from "../../../user/dtos/responses/user-v1.response";
import type { IAuthResultDataToken } from "../../shared/interfaces/auth-result-data-token.interface";
import type { ILoginResult } from "../../shared/interfaces/login-result.interface";
import { ApiProperty } from "@nestjs/swagger";

export class LoginV1Response {
  @ApiProperty({ type: () => UserV1Response })
  user: UserV1Response
  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      accessTokenExpiresIn: { type: 'string', format: 'date-time' },
      refreshToken: { type: 'string' },
      refreshTokenExpiresIn: { type: 'string', format: 'date-time' },
    },
  })
  token: IAuthResultDataToken

  constructor(entity: ILoginResult) {
    this.user = UserV1Response.MapEntity(entity.user);
    this.token = {
      accessToken: entity.token.accessToken,
      accessTokenExpiresIn: entity.token.accessTokenExpiresIn,
      refreshToken: entity.token.refreshToken,
      refreshTokenExpiresIn: entity.token.refreshTokenExpiresIn,
    };
  }

  static MapEntity(entity: ILoginResult): LoginV1Response {
    return new LoginV1Response(entity);
  }
}