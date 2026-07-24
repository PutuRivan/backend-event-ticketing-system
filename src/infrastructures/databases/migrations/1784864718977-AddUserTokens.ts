import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTokens1784864718977 implements MigrationInterface {

    name = 'AddUserTokens1784864718977'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TYPE "user_tokens_type_enum" AS ENUM(
                'refresh-token',
                'forgot-password-token',
                'email-verification-token'
            );
        `);


        await queryRunner.query(`
            CREATE TABLE "user_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,

                "token" VARCHAR NOT NULL UNIQUE,

                "expires_at" TIMESTAMP NOT NULL,

                "type" "user_tokens_type_enum"
                    NOT NULL DEFAULT 'refresh-token',

                "user_id" uuid,

                CONSTRAINT "PK_user_tokens"
                    PRIMARY KEY ("id")
            );
        `);


        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD CONSTRAINT "FK_user_tokens_user"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION;
        `);

    }


    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            DROP CONSTRAINT "FK_user_tokens_user";
        `);


        await queryRunner.query(`
            DROP TABLE "user_tokens";
        `);


        await queryRunner.query(`
            DROP TYPE "user_tokens_type_enum";
        `);

    }

}