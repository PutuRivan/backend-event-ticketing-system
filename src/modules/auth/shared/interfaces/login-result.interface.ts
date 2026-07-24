import { IUser } from "../../../../infrastructures/databases/interfaces/user.interface";
import { IAuthResultDataToken } from "./auth-result-data-token.interface";

export interface ILoginResult {
  user: IUser
  token: IAuthResultDataToken
}