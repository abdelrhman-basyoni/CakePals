import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { appSettings } from '../../shared/app.settings';
@Injectable()
export class RedisService {


    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async set(key: string, value: string) {
        await this.redis.set(key, value);
    }
    async delete(key: string) {
         return this.redis.del([key]);
    }

    async get(key: string): Promise<string> {
        return await this.redis.get(key);
    }

    async hset(hash: string, key: string, value: string) {
        await this.redis.hset(hash, key, value);
    }

    async hget(hash: string, key: string): Promise<string> {
        return await this.redis.hget(hash, key);
    }

    async isBlacklisted(id: string): Promise<boolean> {
        const result = await this.redis.get(id);
        return result !== null;
    }

    async addToBlacklist(id: string): Promise<boolean> {
        const result = await this.redis.set(id, 'true');
        const done = await this.redis.expire(id,appSettings.accessTokenExpiresInSeconds)
        return result !== null;
    }

     getRedis () : Redis{
        return this.redis;
    }
}