import { Module, forwardRef } from '@nestjs/common';
import { TicketsV1Controller } from './controllers/tickets-v1.controller';
import { TicketsV1Repository } from './repositories/tickets-v1.repository';
import { TicketsV1Service } from './services/tickets-v1.service';
import { Tickets } from '../../infrastructures/databases/entities/tickets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '../../infrastructures/modules/queue/queue.module';
import { StorageModule } from '../../infrastructures/modules/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tickets
    ]),

    forwardRef(() => QueueModule),
    StorageModule
  ],
  controllers: [
    TicketsV1Controller
  ],
  providers: [
    TicketsV1Service,
    TicketsV1Repository
  ],
  exports: [
    TicketsV1Service,
    TicketsV1Repository
  ]
})
export class TicketsModule { }
