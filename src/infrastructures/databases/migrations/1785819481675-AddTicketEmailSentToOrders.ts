import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTicketEmailSentToOrders1785819481675 implements MigrationInterface {
    name = 'AddTicketEmailSentToOrders1785819481675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "orders",
            new TableColumn({
                name: "ticket_email_sent",
                type: "boolean",
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "orders",
            "ticket_email_sent"
        );
    }

}
