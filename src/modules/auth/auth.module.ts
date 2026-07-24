import { Module } from '@nestjs/common';
import { AuthV1Controller } from './controllers/auth-v1.controller';
import { UserModule } from '../user/user.module';
import { AuthV1Service } from './services/auth-v1.service';
import { JwtModule } from '../../infrastructures/modules/jwt/jwt.module';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthV1Controller],
  providers: [AuthV1Service],
})
export class AuthModule { }
