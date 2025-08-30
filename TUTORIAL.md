# NestJS + MongoDB 认证后端开发指南

## 🎯 NestJS 架构理解

### 1. NestJS 核心概念
NestJS 采用模块化架构，主要包含：
- **模块 (Module)** - 功能组织单元
- **控制器 (Controller)** - 处理HTTP请求
- **服务 (Service)** - 业务逻辑实现
- **实体 (Entity)** - 数据模型定义

### 2. 认证功能实现逻辑

#### 2.1 请求处理流程
```
前端请求 → 控制器接收 → 服务处理 → 数据库操作 → 返回响应
```

#### 2.2 包依赖说明
- `@nestjs/mongoose` + `mongoose`: MongoDB集成
- `@nestjs/jwt`: JWT token生成验证  
- `bcryptjs`: 密码加密存储
- `@nestjs/passport`: 认证策略（可选）

## 🔧 逐步实现指南

### 步骤1: 创建项目结构
```bash
nest new auth-backend
cd auth-backend
npm install @nestjs/mongoose mongoose @nestjs/jwt bcryptjs
```

### 步骤2: 配置主模块 (app.module.ts)

**为什么这样配置？**
- `MongooseModule.forRoot()`: 建立MongoDB连接
- `AuthModule`: 导入认证功能模块
- 环境变量: 使用process.env获取配置

```typescript
imports: [
  MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-db'),
  AuthModule, // 导入认证模块
]
```

### 步骤3: 创建认证模块 (auth.module.ts)

**模块的作用：**
- 组织相关功能组件
- 配置依赖注入
- 导出可重用的服务

**关键配置解释：**
- `MongooseModule.forFeature()`: 注册User实体到MongoDB
- `JwtModule.register()`: 配置JWT密钥和过期时间
- 控制器和服务通过依赖注入自动连接

### 步骤4: 实现用户实体 (User Entity)

**为什么需要实体？**
- 定义数据库表结构
- 添加数据验证规则
- 提供类型安全的数据库操作

```typescript
@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) // 必填且唯一
  username: string;

  @Prop({ required: true }) // 必填字段
  password: string;
}
```

### 步骤5: 创建用户服务 (User Service)

**服务的职责：**
- 封装业务逻辑
- 处理数据库操作
- 提供可重用的方法

**关键技术点：**
- `@InjectModel(User.name)`: 注入MongoDB模型
- `bcrypt.compare()`: 安全比较密码哈希值
- `bcrypt.hash()`: 加密密码（10是salt rounds）

### 步骤6: 实现JWT服务 (JWT Service)

**JWT的作用：**
- 生成访问令牌
- 验证令牌有效性
- 避免频繁查询数据库

```typescript
// 生成token时包含用户信息
const token = await this.jwtService.sign({
  userId: user._id,      // 用户唯一标识
  username: user.username // 用户名
});
```

### 步骤7: 创建认证控制器 (Auth Controller)

**控制器的职责：**
- 接收HTTP请求
- 调用相应服务
- 返回HTTP响应

**登录流程详解：**
1. 接收前端提交的用户名密码
2. 调用UserService验证凭证
3. 验证失败返回403错误
4. 验证成功生成JWT token
5. 返回200响应和token

```typescript
@Post('login')          // 处理POST请求
@HttpCode(HttpStatus.OK) // 明确返回200状态码
async login(@Body() loginDto: LoginDto) {
  // 1. 验证用户凭证
  const user = await this.userService.validateUser(loginDto.username, loginDto.password);
  
  // 2. 验证失败处理
  if (!user) {
    throw new UnauthorizedException('用户名或密码错误');
  }

  // 3. 生成JWT token
  const token = await this.authJwtService.generateToken({
    userId: user._id,
    username: user.username,
  });

  // 4. 返回成功响应
  return {
    statusCode: HttpStatus.OK,
    message: '登录成功',
    access_token: token,
  };
}
```

### 步骤8: 环境配置的重要性

**.env文件配置：**
```env
JWT_SECRET=your-super-secret-key # JWT签名密钥，生产环境必须修改
MONGODB_URI=mongodb://localhost:27017/auth-db # 数据库连接字符串
```

**为什么需要环境变量？**
- 安全: 避免敏感信息硬编码在代码中
- 灵活: 不同环境使用不同配置
- 可维护: 配置集中管理

## 🚀 运行和测试

### 启动项目
```bash
npm run start:dev
```

### 测试API
使用curl测试：
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 预期响应
**成功 (200):**
```json
{
  "statusCode": 200,
  "message": "登录成功",
  "access_token": "jwt.token.here"
}
```

**失败 (403):**
```json
{
  "statusCode": 403,
  "message": "用户名或密码错误"
}
```

## 💡 最佳实践建议

1. **密码安全**: 永远不要明文存储密码，使用bcrypt加密
2. **错误处理**: 统一的错误响应格式
3. **代码组织**: 遵循单一职责原则
4. **类型安全**: 充分利用TypeScript的类型系统
5. **环境配置**: 使用环境变量管理敏感信息

## 🔄 扩展思路

1. 添加用户注册功能
2. 实现token刷新机制
3. 添加权限控制中间件
4. 集成Swagger API文档
5. 添加单元测试和集成测试

通过这个架构，你可以清晰地理解NestJS如何组织代码，各个组件如何协作，以及如何实现一个完整的认证系统。