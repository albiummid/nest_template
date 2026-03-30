// auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { ENV } from '@/config/env';

interface RefreshTokenPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

interface ValidatedRefreshToken {
  sub: number;
  email: string;
  refreshToken: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const body = request.body as Record<string, string> | undefined;
          return request.cookies?.refreshToken || body?.refreshToken || null;
        },
      ]),
      secretOrKey: ENV.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(
    req: FastifyRequest,
    payload: RefreshTokenPayload,
  ): ValidatedRefreshToken {
    const refreshToken =
      req.cookies?.refreshToken ||
      (req.body as Record<string, string>)?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
