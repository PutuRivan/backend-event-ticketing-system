import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddQuantityToOrders1785083987555 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "orders",
            new TableColumn({
                name: "quantity",
                type: "integer",
                isNullable: false,
                default: 1,
            }),
        );
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "orders",
            "quantity",
        );
    }

}
