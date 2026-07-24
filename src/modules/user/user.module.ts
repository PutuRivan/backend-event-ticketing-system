import { UserV1Controller } from './controllers/user-v1.controller';
import { Module } from '@nestjs/common';
import { UserV1Repository } from './repositories/user-v1.repository';
import { UserV1Service } from './services/user-v1.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../infrastructures/databases/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UserV1Controller,],
  providers: [
    // Repositories
    UserV1Repository,
    // Services
    UserV1Service,
  ],
  exports: []
})
export class UserModule { }
