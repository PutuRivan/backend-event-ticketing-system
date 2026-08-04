import { IUser } from '../../../../infrastructures/databases/interfaces/user.interface';
import { IAuthResultDataToken } from './auth-result-data-token.interface';

export interface IAuthResultData {
    user: IUser;
    token: IAuthResultDataToken;
}
