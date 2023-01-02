import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dtos/token.dto';
import { config } from './config';
import { TokenTypes } from '../enums/tokenTypes.enum';
export async function hashPassword(candidatePassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(candidatePassword, salt);
    return hashedPassword
}

export function removeKeys(keys: string[], object: any) {

    const clone = Object.create(object)
    keys.forEach(key => {
        delete clone[key];
    });
    return clone
}

export async function testSignToken (payload:TokenDto,tokenType:TokenTypes){
    let secret;
    switch(tokenType){
        case(TokenTypes.access):{
            secret = process.env.ACCESS_TOKEN_SECRET;
            break;
        }
        case(TokenTypes.refresh):{
            secret = process.env.REFRESH_TOKEN_SECRET;
            break;
        }
    }

    const jwtService = new JwtService()
    const token = await jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '1y'
    });
    return token;
}