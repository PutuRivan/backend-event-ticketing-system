import { UserV1Response } from "../../../user/dtos/responses/user-v1.response";
import { IAuthResultDataToken } from "../../shared/interfaces/auth-result-data-token.interface";
import { ILoginResult } from "../../shared/interfaces/login-result.interface";

export class LoginV1Response {
  user: UserV1Response
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