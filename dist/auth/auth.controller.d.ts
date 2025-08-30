import { HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthJwtService } from './jwt.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private userService;
    private authJwtService;
    constructor(userService: UserService, authJwtService: AuthJwtService);
    register(registerDto: RegisterDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        access_token: string;
    }>;
}
