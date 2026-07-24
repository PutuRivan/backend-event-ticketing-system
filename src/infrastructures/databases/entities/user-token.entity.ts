import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IUserToken } from '../interfaces/user-token.interface';
import { UserTokenTypeEnum } from '../../../shared/enums/user-token.enum';
import { IUser } from '../interfaces/user.interface';
import { Users } from './users.entity';

@Entity('user_tokens')
export class UserToken extends BaseEntity implements IUserToken {
    @ManyToOne(
        () => Users,
        (user) => user.userTokens,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'user_id',
    })
    user?: Users;


    @Column({
        unique: true,
    })
    token!: string;


    @Column({
        type: 'timestamp',
    })
    expiresAt!: Date;


    @Column({
        type: 'enum',
        enum: UserTokenTypeEnum,
        default: UserTokenTypeEnum.RefreshToken,
    })
    type!: UserTokenTypeEnum;
}
