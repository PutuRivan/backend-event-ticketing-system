import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { createDataSourceWithAnalyzer } from 'typeorm-query-analyzer';
import { config } from '../../config';

export const databaseConfig: DataSourceOptions & SeederOptions =
  createDataSourceWithAnalyzer<DataSourceOptions & SeederOptions>({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    entities: [`${__dirname}/entities/**/*{.ts,.js}`],
    seeds: [`${__dirname}/seeds/*.seeder.ts`],
    // factories: ['src/infrastructures/databases/factories/*.ts'], //TODO: implement factories for seeding
    seedTracking: false,
    synchronize: false,
    logging: config.nodeEnv === 'development',
    migrations: [`${__dirname}/migrations/*.ts`],
    namingStrategy: new SnakeNamingStrategy(),
    poolSize: config.db.poolSize,
    connectTimeoutMS: config.db.connectTimeoutMS,
  });

const dataSource = new DataSource(databaseConfig);
export default dataSource;
