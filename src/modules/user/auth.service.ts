import { BadRequestException, Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../../dtos/login.dto";
import { TokenDto } from "../../dtos/token.dto";
import { UserRoles } from "../../enums/userRoles.enum";
import { appSettings } from "../../shared/app.settings";
import { errors, messages } from "../../shared/responseCodes";
import { RedisService } from "../cache/redis.service";
import { UserService } from "./user.service";



export class AuthService {
    constructor(

        private jwtService: JwtService,
        private userService: UserService,
        @Inject(RedisService) private redisService: RedisService
    ) {

    }

    async login(body: LoginDto) {
        const user = await this.userService.findOne({ email: body.email }, { password: 1, username: 1, email: 1, role: 1 })
        if (!user) {
            throw new UnauthorizedException('invalid user');
        }

        if (!await user.checkPassword(body.password)) {
            throw new UnauthorizedException('invalid user');
        }
        const payload: TokenDto = {
            _id: user._id,
            role: user.role

        }
        user.password = undefined; // remove the password
        const [refreshToken, accessToken] = await Promise.all([
            this.createRefreshToken(payload),
            this.createAccessToken(payload)
        ])
        const loggedUser = await this.userService.findByIdAndUpdate(user._id, { refreshToken: refreshToken })
        await this.redisService.delete(user._id)

        if (!loggedUser) {
            throw new BadRequestException(errors.loginFailed)
        }
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                user: user,
                accessToken,
                refreshToken
            }
        }

    }

    async logout(userId: string) {
        /**
         * delete the refreshToken of the 
         */
        const user = await this.userService.findByIdAndUpdate(userId, { $unset: { refreshToken: "", } })
        if (!user) {
            throw new BadRequestException(errors.logoutFailed)
        }
        const done = await this.redisService.addToBlacklist(userId);

        if (!done) {
            throw new BadRequestException(errors.logoutFailed)
        }
        return done;
    }

    async refreshToken(token: string) {
        const user = await this.userService.findOne({ refreshToken: token });
        if (!user) {
            throw new BadRequestException(errors.notFound)
        }
        const payload: TokenDto = {
            _id: user._id,
            role: user.role

        }
        const accessToken = await this.createRefreshToken(payload);

        return accessToken;
    }

    async guestToken(address: string) {
        const payload  = {
            _id:address,
            role:UserRoles.guest

        }
        const token = await this.createAccessToken(payload);

        return token;

    }



    async createAccessToken(payload: TokenDto) {
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: appSettings.accessTokenExpiresIn
        });
        return refreshToken;
    }

    async createRefreshToken(payload: TokenDto) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: appSettings.refreshTokenExpiresIn
        });
        return accessToken;
    }

}