// 简单的认证功能测试脚本
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  try {
    console.log('测试认证API...');
    
    // 测试登录接口
    const loginData = {
      username: 'testuser',
      password: 'testpass'
    };
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('登录响应:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('HTTP错误状态:', error.response.status);
      console.log('错误响应:', error.response.data);
    } else {
      console.log('网络错误:', error.message);
    }
  }
}

// 运行测试
testAuth();