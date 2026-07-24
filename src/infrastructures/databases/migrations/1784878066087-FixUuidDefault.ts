import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUuidDefault1784878066087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS pgcrypto;
        `);


        await queryRunner.query(`
            ALTER TABLE users
            ALTER COLUMN id
            SET DEFAULT gen_random_uuid();
        `);


        await queryRunner.query(`
            ALTER TABLE event_categories
            ALTER COLUMN id
            SET DEFAULT gen_random_uuid();
        `);


        await queryRunner.query(`
            ALTER TABLE events
            ALTER COLUMN id
            SET DEFAULT gen_random_uuid();
        `);


        await queryRunner.query(`
            ALTER TABLE orders
            ALTER COLUMN id
            SET DEFAULT gen_random_uuid();
        `);


        await queryRunner.query(`
            ALTER TABLE tickets
            ALTER COLUMN id
            SET DEFAULT gen_random_uuid();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE users
            ALTER COLUMN id
            DROP DEFAULT;
        `);


        await queryRunner.query(`
            ALTER TABLE event_categories
            ALTER COLUMN id
            DROP DEFAULT;
        `);


        await queryRunner.query(`
            ALTER TABLE events
            ALTER COLUMN id
            DROP DEFAULT;
        `);


        await queryRunner.query(`
            ALTER TABLE orders
            ALTER COLUMN id
            DROP DEFAULT;
        `);


        await queryRunner.query(`
            ALTER TABLE tickets
            ALTER COLUMN id
            DROP DEFAULT;
        `);
    }

}
