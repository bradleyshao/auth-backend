import { Model } from 'mongoose';
import { User } from './entities/user.entity';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    findByUsername(username: string): Promise<User | null>;
    validateUser(username: string, password: string): Promise<User | null>;
    createUser(username: string, password: string): Promise<User>;
}
