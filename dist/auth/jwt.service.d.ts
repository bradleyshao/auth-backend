import { JwtService } from '@nestjs/jwt';
export declare class AuthJwtService {
    private jwtService;
    constructor(jwtService: JwtService);
    generateToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
}
