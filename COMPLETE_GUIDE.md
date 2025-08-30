### 阶段七：测试和运行

#### 步骤12: MongoDB本地安装与启动

##### macOS系统安装
1. 安装Homebrew（如果尚未安装）：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 通过Homebrew安装MongoDB：
```bash
brew tap mongodb/brew
brew install mongodb-community
```

3. 启动MongoDB服务：
```bash
brew services start mongodb-community
```

4. 验证安装：
```bash
mongosh
> show dbs  # 查看数据库列表
```

##### Windows系统安装
1. 下载MongoDB Community Server：
   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

2. 运行安装程序，选择"Complete"完整安装

3. 创建数据目录：
```bash
md \data\db
```

4. 启动MongoDB服务：
```bash
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="\data\db"
```

##### Ubuntu/Debian系统安装
1. 导入MongoDB公钥：
```bash
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
```

2. 创建源列表文件：
```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

3. 更新包管理器并安装：
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

4. 启动MongoDB服务：
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

##### 常见问题解决
1. **端口占用**：MongoDB默认使用27017端口
```bash
# 查看端口占用
netstat -ano | findstr 27017  # Windows
lsof -i :27017                # macOS/Linux
```

2. **权限问题**：
```bash
# macOS/Linux可能需要sudo权限
sudo chown -R `id -un` /data/db
```

3. **服务无法启动**：
```bash
# 查看日志定位问题
tail -f /var/log/mongodb/mongod.log  # Linux
cat /usr/local/var/log/mongodb/mongo.log  # macOS
```
