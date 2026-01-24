// auth/guards/refresh.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTRefreshGuard extends AuthGuard('jwt-refresh') {}
