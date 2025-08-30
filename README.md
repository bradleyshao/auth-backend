# NestJS + MongoDB 认证后端

这是一个基于NestJS和MongoDB的用户认证后端，支持JWT token验证。

## 功能特性

- 用户登录验证
- JWT token生成和验证
- MongoDB用户数据存储
- 密码加密存储（bcrypt）

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动MongoDB服务（确保MongoDB正在运行）

3. 配置环境变量（复制.env.example到.env并修改）：
```bash
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://localhost:27017/auth-db
PORT=3000
```

4. 启动开发服务器：
```bash
npm run start:dev
```

## API接口

### POST /auth/login

用户登录接口

**请求体：**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**成功响应 (200)：**
```json
{
  "statusCode": 200,
  "message": "登录成功",
  "access_token": "jwt.token.here"
}
```

**失败响应 (403)：**
```json
{
  "statusCode": 403,
  "message": "用户名或密码错误",
  "error": "Unauthorized"
}
```

## 与Next.js前端集成

在前端Next.js项目中，可以使用以下方式调用登录接口：

```javascript
// 登录请求示例
const login = async (username, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    // 存储JWT token
    localStorage.setItem('token', data.access_token);
    return data;
  } else {
    throw new Error('登录失败');
  }
};

// 在API请求中携带JWT token
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};
```

## 环境变量

- `JWT_SECRET`: JWT签名密钥（生产环境请使用强密码）
- `MONGODB_URI`: MongoDB连接字符串
- `PORT`: 服务端口（默认3000）