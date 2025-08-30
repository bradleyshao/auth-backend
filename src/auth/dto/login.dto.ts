// 登录数据传输对象 (DTO)，用于验证和类型检查前端传入的数据
export class LoginDto {
  username: string; // 用户名字段，必填
  password: string; // 密码字段，必填
}
