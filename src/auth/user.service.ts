// 导入NestJS的核心装饰器和Mongoose相关模块
import { Injectable } from '@nestjs/common'; // @Injectable表示这是一个可注入的服务
import { InjectModel } from '@nestjs/mongoose'; // 用于注入Mongoose模型
import { Model } from 'mongoose'; // Mongoose的Model类型
import { User } from './entities/user.entity'; // 导入用户实体
import * as bcrypt from 'bcryptjs'; // 密码加密库

// @Injectable装饰器表示这个类可以被NestJS的依赖注入系统管理
@Injectable()
export class UserService {
  // 构造函数，通过依赖注入获取User模型
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // 注入User模型，用于数据库操作
  ) {}

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<(User & { _id: any }) | null> {
    return this.userModel.findOne({ username }).exec(); // 在数据库中查找用户名匹配的用户
  }

  // 验证用户凭证：用户名和密码
  async validateUser(username: string, password: string): Promise<User | null> {
    // 1. 首先根据用户名查找用户
    const user = await this.findByUsername(username);
    // 2. 如果用户存在且密码匹配（使用bcrypt比较加密后的密码）
    if (user && await bcrypt.compare(password, user.password)) {
      return user; // 验证成功，返回用户信息
    }
    return null; // 验证失败，返回null
  }

  // 创建新用户
  async createUser(username: string, password: string): Promise<User> {
    // 1. 对密码进行加密处理，10是salt的轮数（成本因子）
    const hashedPassword = await bcrypt.hash(password, 10);
    // 2. 创建新的用户实例
    const user = new this.userModel({
      username,
      password: hashedPassword, // 存储加密后的密码
      access: {
        access1: 'card1',
        access2: 'card2'
      } // 给新用户分配默认权限
    });
    // 3. 保存用户到数据库并返回结果
    return user.save();
  }

  // 更新用户信息
  async updateUser(
    userId: string, 
    update: {
      newUsername?: string,
      newPassword?: string,
      currentPassword?: string
    }
  ): Promise<User> {
    // 1. 查找用户
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // 2. 验证当前密码（如果更新密码或用户名）
    if ((update.newPassword || update.newUsername) && !update.currentPassword) {
      throw new Error('Current password is required for security-sensitive updates');
    }

    if (update.currentPassword && !await bcrypt.compare(update.currentPassword, user.password)) {
      throw new Error('Current password is incorrect');
    }

    // 3. 检查用户名唯一性
    if (update.newUsername) {
      const existingUser = await this.findByUsername(update.newUsername);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Username already taken');
      }
      user.username = update.newUsername;
    }

    // 4. 加密新密码
    if (update.newPassword) {
      user.password = await bcrypt.hash(update.newPassword, 10);
    }

    // 5. 保存并返回更新后的用户
    return user.save();
  }
}
