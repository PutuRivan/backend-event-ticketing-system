import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_env,
  app: {
    name: process.env.APP_NAME ?? 'NestJS Boilerplate',
    key: process.env.APP_KEY ?? 'base64:randomkey',
    debug: process.env.APP_DEBUG === 'true',
    port: +(process.env.APP_PORT ?? 3000),
    tz: process.env.APP_TZ ?? 'UTC',
    requestBodyLimitInBytes: +(
      process.env.REQUEST_BODY_LIMIT_IN_BYTES ?? 102400
    ), // 100 KB
    requestUrlencodedBodyLimitInBytes: +(
      process.env.REQUEST_URLENCODED_BODY_LIMIT_IN_BYTES ?? 1048576
    ), // 1 MB
  },
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: +(process.env.DB_PORT ?? 5432),
    database: process.env.DB_DATABASE ?? 'database',
    username: process.env.DB_USERNAME ?? 'user',
    password: process.env.DB_PASSWORD ?? 'password',
    deletedRecordPrefix: process.env.DB_DELETED_RECORD_PREFIX ?? 'deleted',
    poolSize: +(process.env.DB_POOL_SIZE ?? 10),
    connectTimeoutMS: +(process.env.DB_CONNECT_TIMEOUT_IN_MS ?? 30000),
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    rootPath: process.env.STORAGE_ROOT_PATH || 'storages',
    fileMaxSizeInBytes: +(
      process.env.STORAGE_FILE_MAX_SIZE_IN_BYTES || 10485760
    ), // 10 MB
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInSeconds: +(process.env.JWT_EXPIRES_IN_SECONDS ?? 86400), // 1 day
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? '',
    refreshTokenExpiresInSeconds: +(
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS ?? 604800
    ), // 7 days
    forgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_SECRET || '',
    forgotPasswordExpiresInSeconds: +(
      process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN_SECONDS || 3600
    ), // 1 hour,
  },
}