// 导入NestJS的核心装饰器和HTTP状态码常量
import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, ConflictException, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
// Controller: 定义控制器类
// Post: 处理HTTP POST请求
// Body: 获取请求体数据
// HttpCode: 设置HTTP响应状态码
// HttpStatus: HTTP状态码常量
// UnauthorizedException: 未授权异常

import { UserService } from './user.service'; // 导入用户服务，处理用户相关逻辑
import { AuthJwtService } from './jwt.service'; // 导入JWT服务，处理token生成验证
import { LoginDto } from './dto/login.dto'; // 导入登录数据传输对象
import { RegisterDto } from './dto/register.dto'; // 导入注册数据传输对象
import { UpdateProfileDto } from './dto/update-profile.dto'; // 导入更新资料DTO
import { JwtAuthGuard } from './jwt-auth.guard';

// @Controller装饰器定义这是一个控制器，'auth'表示路由前缀为/auth
@Controller('auth')
export class AuthController {
  // 构造函数，通过依赖注入获取所需服务
  constructor(
    private userService: UserService, // 注入用户服务
    private authJwtService: AuthJwtService, // 注入JWT服务
  ) {}

  // 用户注册
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // 1. 检查是否已存在同名用户
    const exists = await this.userService.findByUsername(registerDto.username);
    if (exists) {
      // 409 冲突
      throw new ConflictException('用户名已存在');
    }
    // 2. 创建用户（内部会进行密码哈希）
    const user = await this.userService.createUser(registerDto.username, registerDto.password);
    // 3. 生成 token 返回
    const token = await this.authJwtService.generateToken({
      userId: user._id,
      username: user.username,
      access: user.access // 添加access权限信息
    });
    // 打印用户名、原始密码、加密密码和token
    console.log('[REGISTER]', {
      username: registerDto.username,
      rawPassword: registerDto.password,
      hashedPassword: user.password,
      token,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: '注册成功',
      access_token: token,
    };
  }

  // @Post装饰器处理POST请求，'login'表示路由为/auth/login
  @Post('login')
  // @HttpCode装饰器设置成功时的HTTP状态码为200
  @HttpCode(HttpStatus.OK)
  // 登录处理方法，@Body()自动将请求体转换为LoginDto对象
  async login(@Body() loginDto: LoginDto) {
    // 1. 调用用户服务验证用户名和密码
    const user = await this.userService.validateUser(loginDto.username, loginDto.password);
    
    // 2. 如果验证失败（用户不存在或密码错误）
    if (!user) {
      // 失败时也打印用户名、原始密码、（若可得）用户加密密码
      const existing = await this.userService.findByUsername(loginDto.username);
      console.log('[LOGIN-FAILED]', {
        username: loginDto.username,
        rawPassword: loginDto.password,
        hashedPassword: existing?.password ?? 'N/A',
        token: 'N/A',
      });
      // 抛出未授权异常，返回403状态码和错误信息
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 3. 验证成功，生成JWT token，包含用户ID和用户名
    const token = await this.authJwtService.generateToken({
      userId: user._id, // 用户唯一标识
      username: user.username, // 用户名
      access: user.access // 添加access权限信息
    });
    // 打印用户名、原始密码、加密密码和token
    console.log('[LOGIN-SUCCESS]', {
      username: loginDto.username,
      rawPassword: loginDto.password,
      hashedPassword: user.password,
      token,
    });

    // 4. 返回成功响应，包含状态码、消息和access_token
    return {
      statusCode: HttpStatus.OK, // 200状态码
      message: '登录成功', // 成功消息
      access_token: token, // JWT token，前端需要保存此token用于后续请求
    };
  }

  // 更新用户资料
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateDto: UpdateProfileDto,
    @Req() req: Request & { user?: { userId: string } }
  ) {
    let token: string;
    let updatedUser: any;
    
    try {
      // 1. 从请求中获取用户ID（需要JWT守卫预先注入）
      const userId = req.user?.userId;
      if (!userId) {
        throw new UnauthorizedException('未授权访问');
      }
      
      // 2. 验证请求数据
      if (!updateDto.currentPassword && (updateDto.newUsername || updateDto.newPassword)) {
        throw new UnauthorizedException('修改用户名或密码需要提供当前密码');
      }
    
      // 2. 调用服务更新用户信息
      updatedUser = await this.userService.updateUser(
        userId,
        {
          newUsername: updateDto.newUsername,
          newPassword: updateDto.newPassword,
          currentPassword: updateDto.currentPassword
        }
      );

      // 3. 生成新token
      token = await this.authJwtService.generateToken({
        userId: updatedUser._id,
        username: updatedUser.username,
        access: updatedUser.access
      });

    } catch (error) {
      console.error('更新资料失败:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ConflictException(error.message || '更新资料失败');
    }

    // 4. 返回响应
    return {
      statusCode: HttpStatus.OK,
      message: '资料更新成功',
      access_token: token,
      user: {
        userId: updatedUser._id,
        username: updatedUser.username
      }
    };
  }
}
