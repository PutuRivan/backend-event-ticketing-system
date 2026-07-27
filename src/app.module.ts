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
import { QueueModule } from './infrastructures/modules/queue/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { config } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    BullModule.forRoot({
      connection: {
        host: config.redis.host,
        port: config.redis.port,
      }
    }),
    AuthModule,
    UserModule,
    EventCategoriesModule,
    EventModule,
    OrdersModule,
    TicketsModule,

    QueueModule
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
