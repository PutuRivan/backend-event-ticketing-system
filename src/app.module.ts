import { TicketsModule } from './modules/tickets/tickets.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructures/databases/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventCategoriesModule } from './modules/event-categories/event-categories.module';
import { EventModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructures/modules/jwt/guards/jwt-auth.guard';
import { RoleGuard } from './infrastructures/modules/jwt/guards/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    EventCategoriesModule,
    EventModule,
    OrdersModule,
    TicketsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule { }
