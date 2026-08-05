import { DataSource, QueryRunner } from 'typeorm';

/**
 * Utility class for transaction operations
 */
export class TransactionUtil {
    /**
     * Execute a function within a transaction
     * @param dataSource TypeORM DataSource instance
     * @param callback Function to execute within the transaction
     * @param isolationLevel Optional transaction isolation level
     * @returns Result of the callback function
     */
    static async execute<T>(
        dataSource: DataSource,
        callback: (queryRunner: QueryRunner) => Promise<T>,
        isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE',
    ): Promise<T> {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(isolationLevel);

        try {
            const result = await callback(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}