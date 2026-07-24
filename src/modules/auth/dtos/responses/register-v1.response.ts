import { UserV1Response } from "../../../user/dtos/responses/user-v1.response";
import { IRegisterResult } from "../../shared/interfaces/register-result.interface";

export class RegisterV1Response {
  user: UserV1Response

  constructor(entity: IRegisterResult) {
    this.user = UserV1Response.MapEntity(entity.user);
  }

  static MapEntity(entity: IRegisterResult): RegisterV1Response {
    return new RegisterV1Response(entity);
  }
}