import { Injectable } from '@nestjs/common';
// import * as Redis from 'ioredis';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { config } from '../../shared/config';
@Injectable()
export class RedisService {


    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async set(key: string, value: string) {
        await this.redis.set(key, value);
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
        const done = await this.redis.expire(id,config.accessTokenExpiresInSeconds)
        return result !== null;
    }
}