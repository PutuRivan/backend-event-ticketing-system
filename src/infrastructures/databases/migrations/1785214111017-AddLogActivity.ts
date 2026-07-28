import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class AddLogActivity1785214111017 implements MigrationInterface {
    name = 'AddLogActivity1785214111017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'log_activities',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'source',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'meta_data',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'activity',
                        type: 'varchar',
                    },
                    {
                        name: 'menu',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'path',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'ip',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            'log_activities',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );


        await queryRunner.createIndex(
            'log_activities',
            new TableIndex({
                name: 'IDX_LOG_ACTIVITY_USER_CREATED',
                columnNames: ['user_id', 'created_at'],
            }),
        );


        await queryRunner.createIndex(
            'log_activities',
            new TableIndex({
                name: 'IDX_LOG_ACTIVITY_CREATED_AT',
                columnNames: ['created_at'],
            }),
        );


        await queryRunner.createIndex(
            'log_activities',
            new TableIndex({
                name: 'IDX_LOG_ACTIVITY_USER_ID',
                columnNames: ['user_id'],
            }),
        );
    }


    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey(
            'log_activities',
            'FK_LOG_ACTIVITY_USER',
        );


        await queryRunner.dropIndex(
            'log_activities',
            'IDX_LOG_ACTIVITY_USER_CREATED',
        );


        await queryRunner.dropIndex(
            'log_activities',
            'IDX_LOG_ACTIVITY_CREATED_AT',
        );


        await queryRunner.dropIndex(
            'log_activities',
            'IDX_LOG_ACTIVITY_USER_ID',
        );


        await queryRunner.dropTable('log_activities');
    }

}
