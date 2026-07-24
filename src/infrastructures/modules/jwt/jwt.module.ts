import { Module } from "@nestjs/common";
import { JwtModule as JwtDefaultModule, JwtService } from '@nestjs/jwt';
import { config } from "../../../config";
import { UserModule } from "../../../modules/user/user.module";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";

@Module({
  imports: [
    JwtDefaultModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresInSeconds },
    }),
    UserModule,
  ],
  providers: [JwtStrategy, JwtRefreshStrategy, JwtService],
  exports: [JwtStrategy, JwtRefreshStrategy, JwtService],
})

export class JwtModule { }