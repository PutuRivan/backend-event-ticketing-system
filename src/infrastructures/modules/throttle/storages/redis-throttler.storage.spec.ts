import { RedisThrottlerStorage } from './redis-throttler.storage';

const mockRedis = {
    incr: jest.fn(),
    pexpire: jest.fn(),
    pttl: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
};

jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => mockRedis);
});

jest.mock('src/config', () => ({
    config: {
        app: { name: 'TestApp' },
        nodeEnv: 'test',
        redis: { host: 'localhost', port: 6379, password: '' },
    },
}));

describe('RedisThrottlerStorage', () => {
    let storage: RedisThrottlerStorage;

    beforeEach(() => {
        jest.clearAllMocks();
        storage = new RedisThrottlerStorage();
    });

    describe('increment', () => {
        it('should increment counter and return record when under limit', async () => {
            mockRedis.incr.mockResolvedValue(3);
            mockRedis.pexpire.mockResolvedValue(1);
            mockRedis.pttl.mockResolvedValue(55000);
            mockRedis.get.mockResolvedValue(null);

            const result = await storage.increment(
                '192.168.1.1',
                60000,
                10,
                0,
                'default',
            );

            expect(result.totalHits).toBe(3);
            expect(result.isBlocked).toBe(false);
            expect(result.timeToExpire).toBe(55000);
            expect(mockRedis.incr).toHaveBeenCalledWith(
                'TestApp:test:throttle:192.168.1.1:default',
            );
        });

        it('should set expiry on first request', async () => {
            mockRedis.incr.mockResolvedValue(1);
            mockRedis.pexpire.mockResolvedValue(1);
            mockRedis.pttl.mockResolvedValue(60000);
            mockRedis.get.mockResolvedValue(null);

            await storage.increment('10.0.0.1', 60000, 10, 0, 'default');

            expect(mockRedis.pexpire).toHaveBeenCalledWith(
                'TestApp:test:throttle:10.0.0.1:default',
                60000,
            );
        });

        it('should mark as blocked when hits exceed limit with blockDuration', async () => {
            mockRedis.incr.mockResolvedValue(11);
            mockRedis.pttl.mockResolvedValue(50000);
            mockRedis.get.mockResolvedValue(null);
            mockRedis.set.mockResolvedValue('OK');

            const result = await storage.increment(
                '192.168.1.1',
                60000,
                10,
                120000,
                'default',
            );

            expect(result.totalHits).toBe(11);
            expect(result.isBlocked).toBe(true);
            expect(mockRedis.set).toHaveBeenCalled();
        });

        it('should return blocked state when block key exists', async () => {
            mockRedis.get
                .mockResolvedValueOnce('1')   // blockKey exists
                .mockResolvedValueOnce('15'); // current hits
            mockRedis.pttl.mockResolvedValue(90000);

            const result = await storage.increment(
                '192.168.1.1',
                60000,
                10,
                120000,
                'default',
            );

            expect(result.isBlocked).toBe(true);
            expect(result.totalHits).toBe(15);
            expect(result.timeToBlockExpire).toBe(90000);
            expect(mockRedis.incr).not.toHaveBeenCalled();
        });

        it('should use correct Redis key pattern', async () => {
            mockRedis.incr.mockResolvedValue(1);
            mockRedis.pexpire.mockResolvedValue(1);
            mockRedis.pttl.mockResolvedValue(60000);
            mockRedis.get.mockResolvedValue(null);

            await storage.increment('1.2.3.4', 60000, 10, 0, 'custom');

            expect(mockRedis.incr).toHaveBeenCalledWith(
                'TestApp:test:throttle:1.2.3.4:custom',
            );
        });
    });
});
