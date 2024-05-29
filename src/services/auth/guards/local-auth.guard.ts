import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Defines auth guard that matches the strategy named `custom`.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
