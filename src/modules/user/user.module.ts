import { UserV1Controller } from './controllers/user-v1.controller';
import { Module } from '@nestjs/common';
import { UserV1Repository } from './repositories/user-v1.repository';
import { UserV1Service } from './services/user-v1.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../infrastructures/databases/entities/users.entity';
import { UserTokenV1Repository } from './repositories/user-token-v1.repository';
import { UserToken } from '../../infrastructures/databases/entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      UserToken,
    ]),
  ],
  controllers: [UserV1Controller,],
  providers: [
    // Repositories
    UserV1Repository,
    UserTokenV1Repository,

    // Services
    UserV1Service,
  ],
  exports: [
    // Repositories
    UserV1Repository,
    UserTokenV1Repository,

    // Services
    UserV1Service,
  ],
})
export class UserModule { }
