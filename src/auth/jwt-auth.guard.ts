import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthJwtService } from './jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authJwtService: AuthJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user?: any }>();

    const authHeader = request.headers['authorization'] || request.headers['Authorization' as any];
    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('未授权访问');
    }

    const [scheme, token] = authHeader.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('未授权访问');
    }

    const payload = await this.authJwtService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('未授权访问');
    }

    request.user = {
      userId: payload.userId,
      username: payload.username,
      access: payload.access,
    };

    return true;
  }
}


