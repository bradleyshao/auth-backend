import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 配置MongoDB数据库连接，连接到本地的auth-db数据库
    MongooseModule.forRoot('mongodb://localhost:27017/auth-db'),
    // 导入认证模块，包含用户登录验证功能
    AuthModule,
  ],
  // 注册应用控制器，处理根路径的请求
  controllers: [AppController],
  // 注册应用服务，提供业务逻辑
  providers: [AppService],
})
export class AppModule {}
