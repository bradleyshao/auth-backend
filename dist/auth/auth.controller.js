"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_service_1 = require("./jwt.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    userService;
    authJwtService;
    constructor(userService, authJwtService) {
        this.userService = userService;
        this.authJwtService = authJwtService;
    }
    async register(registerDto) {
        const exists = await this.userService.findByUsername(registerDto.username);
        if (exists) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const user = await this.userService.createUser(registerDto.username, registerDto.password);
        const token = await this.authJwtService.generateToken({
            userId: user._id,
            username: user.username,
            access: user.access
        });
        console.log('[REGISTER]', {
            username: registerDto.username,
            rawPassword: registerDto.password,
            hashedPassword: user.password,
            token,
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: '注册成功',
            access_token: token,
        };
    }
    async login(loginDto) {
        const user = await this.userService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            const existing = await this.userService.findByUsername(loginDto.username);
            console.log('[LOGIN-FAILED]', {
                username: loginDto.username,
                rawPassword: loginDto.password,
                hashedPassword: existing?.password ?? 'N/A',
                token: 'N/A',
            });
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const token = await this.authJwtService.generateToken({
            userId: user._id,
            username: user.username,
            access: user.access
        });
        console.log('[LOGIN-SUCCESS]', {
            username: loginDto.username,
            rawPassword: loginDto.password,
            hashedPassword: user.password,
            token,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: '登录成功',
            access_token: token,
        };
    }
    async updateProfile(updateDto, req) {
        let token;
        let updatedUser;
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new common_1.UnauthorizedException('未授权访问');
            }
            if (!updateDto.currentPassword && (updateDto.newUsername || updateDto.newPassword)) {
                throw new common_1.UnauthorizedException('修改用户名或密码需要提供当前密码');
            }
            updatedUser = await this.userService.updateUser(userId, {
                newUsername: updateDto.newUsername,
                newPassword: updateDto.newPassword,
                currentPassword: updateDto.currentPassword
            });
            token = await this.authJwtService.generateToken({
                userId: updatedUser._id,
                username: updatedUser.username,
                access: updatedUser.access
            });
        }
        catch (error) {
            console.error('更新资料失败:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.ConflictException(error.message || '更新资料失败');
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: '资料更新成功',
            access_token: token,
            user: {
                userId: updatedUser._id,
                username: updatedUser.username,
                access: updatedUser.access
            }
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_service_1.AuthJwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map