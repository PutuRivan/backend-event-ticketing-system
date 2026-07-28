import { TicketsModule } from './modules/tickets/tickets.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructures/databases/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventCategoriesModule } from './modules/event-categories/event-categories.module';
import { EventModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructures/modules/jwt/guards/jwt-auth.guard';
import { RoleGuard } from './infrastructures/modules/jwt/guards/permission.guard';
import { QueueModule } from './infrastructures/modules/queue/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { config } from './config';
import { DateTimeUtil } from './shared/utils/datetime.util';
import { LogActivityInterceptor } from './infrastructures/interceptors/log-activity.interceptor';
import { LogActivityModule } from './modules/log-activity/log-activity.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    BullModule.forRoot({
      connection: {
        host: config.redis.host,
        port: config.redis.port,
      },
      prefix: `${config.app.name}:${config.nodeEnv}:bull`,
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
        attempts: config.queue.retryAttempts,
        backoff: {
          type: 'exponential',
          delay: DateTimeUtil.convertSecondsToMilliseconds(
            config.queue.backoffDelayInSeconds
          )
        }
      }
    }),
    AuthModule,
    UserModule,
    EventCategoriesModule,
    EventModule,
    OrdersModule,
    TicketsModule,
    LogActivityModule,

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
    {
      provide: APP_INTERCEPTOR,
      useClass: LogActivityInterceptor,
    },
  ],
})
export class AppModule { }
