// 导入NestJS核心模块和所需的功能模块
import { Module } from '@nestjs/common'; // @Module装饰器用于定义模块
import { JwtModule } from '@nestjs/jwt'; // JWT模块，用于token管理
import { MongooseModule } from '@nestjs/mongoose'; // MongoDB集成模块
import { AuthController } from './auth.controller'; // 认证控制器
import { UserService } from './user.service'; // 用户服务
import { AuthJwtService } from './jwt.service'; // JWT服务
import { User, UserSchema } from './entities/user.entity'; // 用户实体和模式

// @Module装饰器定义认证模块，包含所有认证相关功能
@Module({
  imports: [
    // 注册User实体到MongoDB，使其可以在整个模块中使用
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // 配置JWT模块，设置密钥和token过期时间
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // 从环境变量获取密钥，如果没有则使用默认值
      signOptions: { expiresIn: '24h' }, // token过期时间为24小时
    }),
  ],
  // 注册控制器，处理HTTP请求
  controllers: [AuthController],
  // 注册服务提供者，提供业务逻辑
  providers: [UserService, AuthJwtService],
  // 导出服务，使其可以在其他模块中使用
  exports: [UserService, AuthJwtService],
})
export class AuthModule {}
