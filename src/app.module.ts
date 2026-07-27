import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructures/databases/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventCategoriesModule } from './modules/event-categories/event-categories.module';
import { EventModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    EventCategoriesModule,
    EventModule,
    OrdersModule,
  ],
  providers: [],
})
export class AppModule { }
