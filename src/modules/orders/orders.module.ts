import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../../infrastructures/databases/entities/orders.entity';
import { EventCategories } from '../../infrastructures/databases/entities/event-categories.entity';
import { Events } from '../../infrastructures/databases/entities/events.entity';
import { OrdersV1Controller } from './controllers/orders-v1.controller';
import { OrdersV1Service } from './services/orders-v1.service';
import { OrdersV1Repository } from './repositories/orders-v1.repository';
import { EventV1Repository } from '../events/repositories/events-v1.repository';
import { TicketsModule } from '../tickets/tickets.module';
import { QueueModule } from '../../infrastructures/modules/queue/queue.module';
import { Users } from '../../infrastructures/databases/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      EventCategories,
      Events,
      Users,
    ]),
    forwardRef(() => TicketsModule),
    forwardRef(() => QueueModule),

  ],
  controllers: [
    OrdersV1Controller,
  ],
  providers: [
    OrdersV1Service,

    OrdersV1Repository,
    EventV1Repository,
  ],
  exports: [
    OrdersV1Service,
    OrdersV1Repository,
  ]
})
export class OrdersModule { }
