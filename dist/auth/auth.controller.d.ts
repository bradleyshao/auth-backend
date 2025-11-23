import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthJwtService } from './jwt.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
    updateProfile(updateDto: UpdateProfileDto, req: Request & {
        user?: {
            userId: string;
        };
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        access_token: string;
        user: {
            userId: any;
            username: any;
            access: any;
        };
    }>;
}
