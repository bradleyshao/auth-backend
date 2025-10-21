import { Model } from 'mongoose';
import { User } from './entities/user.entity';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    findByUsername(username: string): Promise<(User & {
        _id: any;
    }) | null>;
    validateUser(username: string, password: string): Promise<User | null>;
    createUser(username: string, password: string): Promise<User>;
    updateUser(userId: string, update: {
        newUsername?: string;
        newPassword?: string;
        currentPassword?: string;
    }): Promise<User>;
}
