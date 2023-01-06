import { Injectable, Inject,ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../modules/cache/redis.service';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(@Inject(RedisService) private  redisService: RedisService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        // Call the super canActivate() method to perform the JWT validation
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();

        if (result) {

            const isBlacklisted = await this.redisService.isBlacklisted(request.user._id);

            return !isBlacklisted;
        }
        return false;
    }
}
