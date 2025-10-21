import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthJwtService } from './jwt.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly authJwtService;
    constructor(authJwtService: AuthJwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
