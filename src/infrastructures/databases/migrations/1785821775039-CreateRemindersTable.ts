import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRemindersTable1785821775039 implements MigrationInterface {
    name = 'CreateRemindersTable1785821775039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."reminders_type_enum" AS ENUM(
            'testing',
            '7_days',
            '1_day',
            '1_hour'
            )
        `);


        await queryRunner.query(`
            CREATE TABLE "reminders" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "order_id" uuid NOT NULL,
            "type" "public"."reminders_type_enum" NOT NULL,
            "scheduled_at" TIMESTAMP NOT NULL,
            "sent_at" TIMESTAMP,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP,
            CONSTRAINT "PK_reminders_id"
                PRIMARY KEY ("id")
            )
        `);


        await queryRunner.query(`
            CREATE INDEX "IDX_reminders_schedule_sent"
            ON "reminders" (
                "scheduled_at",
                "sent_at"
            )
        `);


        await queryRunner.query(`
            ALTER TABLE "reminders"
            ADD CONSTRAINT "FK_reminders_order"
            FOREIGN KEY ("order_id")
            REFERENCES "orders"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reminders"
            DROP CONSTRAINT "FK_reminders_order"
        `);


        await queryRunner.query(`
            DROP INDEX "public"."IDX_reminders_schedule_sent"
        `);


        await queryRunner.query(`
            DROP TABLE "reminders"
        `);


        await queryRunner.query(`
            DROP TYPE "public"."reminders_type_enum"
        `);
    }

}
