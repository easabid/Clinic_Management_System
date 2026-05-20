import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// wrapper passport's JWT guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}