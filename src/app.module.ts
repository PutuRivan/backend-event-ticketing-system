import { TicketsModule } from './modules/tickets/tickets.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructures/databases/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventCategoriesModule } from './modules/event-categories/event-categories.module';
import { EventModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructures/modules/jwt/guards/jwt-auth.guard';
import { RoleGuard } from './infrastructures/modules/jwt/guards/permission.guard';
import { QueueModule } from './infrastructures/modules/queue/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { config } from './config';
import { DateTimeUtil } from './shared/utils/datetime.util';
import { LogActivityInterceptor } from './infrastructures/interceptors/log-activity.interceptor';
import { LogActivityModule } from './modules/log-activity/log-activity.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { ResponseInterceptor } from './infrastructures/interceptors/response.interceptor';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HttpCacheInterceptor } from './infrastructures/modules/cache/interceptors/http-cache.interceptor';
import { CacheModule } from './infrastructures/modules/cache/cache.module';
import { CacheInvalidateInterceptor } from './infrastructures/modules/cache/interceptors/cache-invalidate.interceptor';

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
    MailerModule.forRoot({
      transport: {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false,
        ...(config.smtp.user && config.smtp.password
          ? {
            auth: {
              user: config.smtp.user,
              pass: config.smtp.password,
            },
          }
          : {}),
      },
      defaults: {
        from: `"No Reply" <${config.smtp.emailSender}>`,
      },
      template: {
        dir: join(
          __dirname,
          './infrastructures/modules/mail/templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
    EventCategoriesModule,
    EventModule,
    OrdersModule,
    TicketsModule,
    DashboardModule,
    LogActivityModule,

    QueueModule,
    CacheModule
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
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInvalidateInterceptor,
    },
  ],
})
export class AppModule { }
