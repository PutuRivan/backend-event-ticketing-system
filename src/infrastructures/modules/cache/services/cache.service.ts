import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deleteByPrefix(prefix: string) {
    const keyv: any = this.cacheManager.stores[0];
    if (!keyv || !keyv._store) {
      return;
    }

    const redis = typeof keyv._store.getClient === 'function'
      ? await keyv._store.getClient()
      : (keyv._store.client || keyv._store._client);

    if (!redis) {
      return;
    }

    if (!redis.isOpen && typeof redis.connect === 'function') {
      await redis.connect();
    }

    let cursor = "0";

    do {
      const result = await redis.scan(cursor, {
        MATCH: `*${prefix}*`,
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length) {
        await redis.del(result.keys);
      }

    } while (cursor !== "0");
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }


  async set<T>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<void> {

    await this.cacheManager.set(
      key,
      value,
      ttl,
    );
  }
}