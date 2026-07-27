import { Repository } from "typeorm";
import { Tickets } from "../../../infrastructures/databases/entities/tickets.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITicket } from "../../../infrastructures/databases/interfaces/ticket.interface";

@Injectable()
export class TicketsV1Repository extends Repository<Tickets> {
  constructor(
    @InjectRepository(Tickets)
    private readonly repo: Repository<ITicket>
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }
}