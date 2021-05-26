import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { PrismaClient } from '.prisma/client';

class Payload {
  username: string;
  sub: number;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload) {
    // check is valid account crendentials.
    const { sub: userid } = payload;
    const res = await this.prisma.user.findUnique({ where: { userid } });

    if (!res) {
      return null;
    }

    return {
      userid: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
