import { dbUserFactory } from "../../factory/db/dbUserFactory";
import logger from "../../logger/logger";
import { UserRepository } from "../../repository/v1/user.repository";
class UserService {
    private static instance: UserService;
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async getAllUsers(page: number, limit: number): Promise<any> {
        try {
            const offset = (page - 1) * limit;
            const res = await this.userRepository.findAll({}, ["*"], offset, limit);
            if (!res || res.success === false) {
                return { success: false, message: "No users found" };
            } else {
                return { success: true, data: res.data };
            }
        } catch (error: any) {
            logger.error(`[UserService.getAllUsers] Error fetching user details: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.getAllUsers] Error fetching user details: ${error.message}`);
        }
    }

    async createUser(userData: any): Promise<any> {
        try {
            const dbUser = dbUserFactory(userData); // Format the data for database insertion
            const res = await this.userRepository.create(dbUser);
            if (!res || res.success === false) {
                return { success: false, message: "User creation failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[UserService.createUser] Error creating user: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.createUser] Error creating user: ${error.message}`);
        }
    }

    async updateUser(userId: string, userData: any): Promise<any> {
        try {
            const res = await this.userRepository.update(userId, userData);
            if (!res || res.success === false) {
                return { success: false, message: "User update failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[UserService.updateUser] Error updating user: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.updateUser] Error updating user: ${error.message}`);
        }
    }

    async deleteUser(userId: string): Promise<any> {
        try {
            const res = await this.userRepository.delete(userId);
            if (!res || res.success === false) {
                return { success: false, message: "User deletion failed" };
            } else {
                return { success: true, message: "User deleted successfully" };
            }
        } catch (error: any) {
            logger.error(`[UserService.deleteUser] Error deleting user: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.deleteUser] Error deleting user: ${error.message}`);
        }
    }

    async getUserById(userId: string): Promise<any> {
        try {
            const res = await this.userRepository.findById(userId);
            console.log(res);
            if (!res || res.success === false) {
                return { success: false, message: "User not found" };
            } else {
                if (res.data.length === 0) {
                    return { success: false, message: "User not found" };
                }
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[UserService.getUserById] Error fetching user by ID: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.getUserById] Error fetching user by ID: ${error.message}`);
        }
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            const res = await this.userRepository.findByEmail(email);
            if (!res || res.success === false) {
                return { success: false, message: "User not found" };
            }
            if (res.data.length === 0) {
                return { success: false, message: "User not found" };
            }
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[UserService.getUserByEmail] Error fetching user by email: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.getUserByEmail] Error fetching user by email: ${error.message}`);
        }
    }

};

export default UserService;