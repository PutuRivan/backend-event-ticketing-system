import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const xForwardedFor = req.headers?.['x-forwarded-for'];
        if (xForwardedFor && typeof xForwardedFor === 'string') {
            const firstIp = xForwardedFor.split(',')[0]?.trim();
            if (firstIp) {
                return firstIp;
            }
        }

        const xRealIp = req.headers?.['x-real-ip'];
        if (xRealIp && typeof xRealIp === 'string') {
            return xRealIp.trim();
        }

        return req.ip;
    }
}
