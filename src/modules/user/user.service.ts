import { User, UserDocument } from "../../models/user.model";
import { Model,UpdateQuery,QueryOptions } from "mongoose";
import { AbstractService } from "../../shared/abstract.service";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from "../../dtos/login.dto";
import { TokenDto } from "../../dtos/token.dto";
import { messages } from "../../shared/responseCodes";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';
import { config } from "../../shared/config";
import { hashPassword } from "../../shared/utils";
@Injectable()
export class UserService extends AbstractService<UserDocument> {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService) {
        super(userModel);
    }
    async create(req) {
        /**to follow the open closed princeple OCP */
        req.password = await hashPassword(req.password)
        const res = await super.create(req);
        res.password = undefined;
        return res

    }

    async login(body: LoginDto) {
        const user = await this.findOne({ email: body.email }, { password: 1, userName: 1, role: 1 })
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
        return {
            success: true,
            message: messages.success.message,
            code: messages.success.code,
            data: {
                user: user,
                accessToken: await this.createAccessToken(payload),
                refreshToken: await this.createRefreshToken(payload),
            }
        }

    }


    async createAccessToken(payload: TokenDto) {
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: config.accessTokenExpiresIn
        });
        return refreshToken;
    }

    async createRefreshToken(payload: TokenDto) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: config.refreshTokenExpiresIn
        });
        return accessToken;
    }
}