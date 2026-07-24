import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructures/databases/config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    UserModule
  ],
  providers: [],
})
export class AppModule { }
