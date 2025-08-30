// 导入Mongoose相关的装饰器和类型
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 使用@Schema装饰器定义这是一个Mongoose模式
@Schema()
// User类继承自Document，表示这是一个MongoDB文档
export class User extends Document {
  // @Prop装饰器定义文档属性，required: true表示必填，unique: true表示唯一
  @Prop({ required: true, unique: true })
  username: string; // 用户名字段

  // 密码字段，required: true表示必填
  @Prop({ required: true })
  password: string; // 存储加密后的密码

  // 创建时间字段，default: Date.now表示默认值为当前时间
  @Prop({ default: Date.now })
  createdAt: Date; // 用户创建时间
}

// 使用SchemaFactory根据User类创建Mongoose模式
export const UserSchema = SchemaFactory.createForClass(User);
