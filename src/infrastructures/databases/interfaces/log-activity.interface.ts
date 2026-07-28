import { IBaseEntity } from './base-entity.interface';
import { IUser } from './user.interface';

export interface ILogActivity extends IBaseEntity {
    userId?: string | null;

    source?: string;

    metaData?: any;

    activity: string;

    menu?: string;

    path?: string;

    ip?: string;

    /**
     * Relations
     */
    user?: IUser;
}
