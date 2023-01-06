import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable,Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenDto } from '../dtos/token.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      algorithm: "HS256"
    });
  }

  async validate(payload: any) {
    let tokenPayload: TokenDto
    tokenPayload = {
      _id: payload._id,
      role: payload.role
    }

    return tokenPayload;
  }
}
@Injectable()
export class JwtStrategyRefreshToken extends PassportStrategy(Strategy,'refreshStrategy') {
  
  constructor(

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      algorithm: "HS256"
    });
  }

  async validate(payload: any) {
    let tokenPayload: TokenDto
    tokenPayload = {
      _id: payload._id,
      role: payload.role
    }
    return tokenPayload;
  }
}
