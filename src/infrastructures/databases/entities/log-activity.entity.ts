import { ILogActivity } from './../interfaces/log-activity.interface';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Users } from './users.entity';
import type { IUser } from '../interfaces/user.interface';

@Entity('log_activities')
@Index(['userId', 'createdAt'])
@Index(['createdAt'])
export class LogActivity extends BaseEntity implements ILogActivity {
    @ManyToOne(() => Users)
    @JoinColumn()
    user?: IUser;

    @Index()
    @Column({ nullable: true })
    userId?: string;

    @Column({ nullable: true })
    source?: string;

    @Column({ type: 'json', nullable: true })
    metaData?: any;

    @Column()
    activity!: string;

    @Column({ nullable: true })
    menu?: string;

    @Column({ nullable: true })
    path?: string;

    @Column({ nullable: true })
    ip?: string;
}
