# 🔐 前端集成指南

## 📋 概述
本指南说明如何在前端应用中集成后端认证系统，包括用户注册、登录和 token 的使用。

## 🚀 快速开始

### 1. 后端服务状态
确保后端服务正在运行：
```bash
# 启动后端服务
npm run start:dev
# 服务将在 http://localhost:3000 运行
```

### 2. 测试 API 端点
```bash
# 注册新用户
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 用户登录
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## 🔑 Token 使用说明

### Token 格式
后端返回的 token 格式：
```json
{
  "statusCode": 200,
  "message": "登录成功",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token 存储
```javascript
// 保存 token 到 localStorage
localStorage.setItem('auth_token', response.access_token);

// 从 localStorage 获取 token
const token = localStorage.getItem('auth_token');
```

### Token 在请求中的使用
```javascript
// 在请求头中添加 Authorization
const response = await fetch('/api/protected-resource', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📱 前端集成示例

### React 示例
```jsx
import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        localStorage.setItem('auth_token', data.access_token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用示例
const ProtectedComponent = () => {
  const { token } = useContext(AuthContext);
  
  const fetchData = async () => {
    const response = await fetch('/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // 处理响应...
  };
  
  return <button onClick={fetchData}>获取数据</button>;
};
```

### Vue.js 示例
```vue
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
    
    <div v-if="token">
      <p>已登录，Token: {{ token.substring(0, 20) }}...</p>
      <button @click="fetchProtectedData">获取受保护数据</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      token: localStorage.getItem('auth_token')
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          this.token = data.access_token;
          localStorage.setItem('auth_token', data.access_token);
        }
      } catch (error) {
        console.error('登录失败:', error);
      }
    },
    
    async fetchProtectedData() {
      const response = await fetch('/api/protected', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      // 处理响应...
    }
  }
};
</script>
```

### 原生 JavaScript 示例
```javascript
class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.token = localStorage.getItem('auth_token');
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        this.token = data.access_token;
        localStorage.setItem('auth_token', data.access_token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async register(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        this.token = data.access_token;
        localStorage.setItem('auth_token', data.access_token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async fetchProtectedResource(url) {
    if (!this.token) {
      throw new Error('未登录');
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      this.logout();
      throw new Error('Token 已过期，请重新登录');
    }
    
    return response.json();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// 使用示例
const auth = new AuthService();

// 登录
auth.login('testuser', 'password123').then(result => {
  if (result.success) {
    console.log('登录成功:', result.data);
  } else {
    console.log('登录失败:', result.message);
  }
});

// 获取受保护资源
if (auth.isAuthenticated()) {
  auth.fetchProtectedResource('/api/protected-data')
    .then(data => console.log('数据:', data))
    .catch(error => console.error('错误:', error));
}
```

## 🛡️ 安全最佳实践

### 1. Token 存储
- ✅ 使用 `localStorage` 或 `sessionStorage`
- ❌ 避免存储在全局变量中
- 🔄 定期刷新 token

### 2. 请求拦截
```javascript
// 自动添加 token 到所有请求
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return originalFetch(url, options);
};
```

### 3. 错误处理
```javascript
// 处理 401 未授权错误
if (response.status === 401) {
  // Token 过期或无效
  localStorage.removeItem('auth_token');
  // 重定向到登录页面
  window.location.href = '/login';
}
```

### 4. Token 过期处理
```javascript
// 检查 token 是否即将过期
function isTokenExpiringSoon(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - now;
    
    // 如果 5 分钟内过期，返回 true
    return timeUntilExpiry < 300;
  } catch (error) {
    return true;
  }
}
```

## 🔧 常见问题

### Q: Token 过期后如何处理？
A: 实现自动刷新机制或重定向到登录页面。

### Q: 如何保护前端路由？
A: 使用路由守卫检查 token 有效性。

### Q: 跨域问题如何解决？
A: 确保后端配置了正确的 CORS 设置。

### Q: 如何实现记住登录状态？
A: 使用 `localStorage` 存储 token，`sessionStorage` 用于会话期间。

## 📚 相关资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [JWT 介绍](https://jwt.io/introduction)
- [前端安全最佳实践](https://owasp.org/www-project-top-ten/)
- [HTTP 认证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
