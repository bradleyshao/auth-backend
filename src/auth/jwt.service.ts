// 导入NestJS核心装饰器和JWT服务
import { Injectable } from '@nestjs/common'; // @Injectable表示这是一个可注入的服务
import { JwtService } from '@nestjs/jwt'; // NestJS的JWT服务，用于token操作

// @Injectable装饰器表示这个类可以被NestJS的依赖注入系统管理
@Injectable()
export class AuthJwtService {
  // 构造函数，通过依赖注入获取JwtService实例
  constructor(private jwtService: JwtService) {} // 注入JWT服务

  // 生成JWT token的方法
  async generateToken(payload: any): Promise<string> {
    // 使用JwtService的sign方法生成token，payload包含要编码的用户信息
    return this.jwtService.sign(payload);
  }

  // 验证JWT token的方法
  async verifyToken(token: string): Promise<any> {
    try {
      // 使用JwtService的verify方法验证token有效性
      return this.jwtService.verify(token);
    } catch (error) {
      // 如果token验证失败（过期、格式错误等），返回null
      return null;
    }
  }
}
