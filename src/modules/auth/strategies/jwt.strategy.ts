// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ENV } from '@/config/env';

interface JwtPayload {
  sub: number;
  email: string;
  roles?: string[];
}

interface ValidatedUser {
  id: number;
  email: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    const user = await this.authService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
