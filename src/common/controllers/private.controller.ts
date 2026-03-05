import { UseGuards } from '@nestjs/common';
import { BaseController } from './base.controller';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
export class PrivateController extends BaseController {}
