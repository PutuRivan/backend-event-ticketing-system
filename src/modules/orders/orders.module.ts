import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../../infrastructures/databases/entities/orders.entity';
import { EventCategories } from '../../infrastructures/databases/entities/event-categories.entity';
import { Events } from '../../infrastructures/databases/entities/events.entity';
import { Users } from '../../infrastructures/databases/entities/users.entity';
import { OrdersV1Controller } from './controllers/orders-v1.controller';
import { OrdersV1Service } from './services/orders-v1.service';
import { OrdersV1Repository } from './repositories/orders-v1.repository';
import { EventV1Repository } from '../events/repositories/events-v1.repository';
import { EventCategoriesV1Repository } from '../event-categories/repositories/event-categories-v1.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      EventCategories,
      Events,
    ]),
  ],
  controllers: [
    OrdersV1Controller,
  ],
  providers: [
    OrdersV1Service,

    OrdersV1Repository,
    EventV1Repository,
    EventCategoriesV1Repository
  ],
  exports: [
    OrdersV1Service,
    OrdersV1Repository,
  ]
})
export class OrdersModule { }
