// auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { ENV } from '@/config/env';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          return (
            request.cookies?.refreshToken ||
            (request.body as any)?.refreshToken ||
            null
          );
        },
      ]),
      secretOrKey: ENV.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    const refreshToken =
      req.cookies?.refreshToken || (req.body as any)?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
