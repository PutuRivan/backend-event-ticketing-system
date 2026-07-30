/* eslint-disable @typescript-eslint/naming-convention */
import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
    let guard: CustomThrottlerGuard;

    beforeEach(() => {
        guard = new CustomThrottlerGuard(
            {} as any,
            {} as any,
            {} as any,
        );
    });

    describe('getTracker', () => {
        it('should return first IP from X-Forwarded-For header', async () => {
            const req = {
                headers: {
                    'x-forwarded-for':
                        '203.0.113.50, 70.41.3.18, 150.172.238.178',
                },
                ip: '127.0.0.1',
            };

            const tracker = await (guard as any).getTracker(req);
            expect(tracker).toBe('203.0.113.50');
        });

        it('should return X-Real-IP when X-Forwarded-For is not present', async () => {
            const req = {
                headers: { 'x-real-ip': '10.0.0.1' },
                ip: '127.0.0.1',
            };

            const tracker = await (guard as any).getTracker(req);
            expect(tracker).toBe('10.0.0.1');
        });

        it('should return req.ip as fallback', async () => {
            const req = {
                headers: {},
                ip: '192.168.1.100',
            };

            const tracker = await (guard as any).getTracker(req);
            expect(tracker).toBe('192.168.1.100');
        });

        it('should trim whitespace from X-Forwarded-For IPs', async () => {
            const req = {
                headers: {
                    'x-forwarded-for': '  10.20.30.40  , 50.60.70.80',
                },
                ip: '127.0.0.1',
            };

            const tracker = await (guard as any).getTracker(req);
            expect(tracker).toBe('10.20.30.40');
        });

        it('should fallback to req.ip when X-Forwarded-For is empty', async () => {
            const req = {
                headers: { 'x-forwarded-for': '' },
                ip: '172.16.0.1',
            };

            const tracker = await (guard as any).getTracker(req);
            expect(tracker).toBe('172.16.0.1');
        });
    });
});
