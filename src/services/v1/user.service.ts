import { dbUserFactory } from "../../factory/db/dbUserFactory";
import logger from "../../logger/v1/logger";
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
                logger.error(`[UserService.getAllUsers] Error fetching user details: ${JSON.stringify(res)}`);
                return { success: false, message: "No users found" };
            } else {
                return { success: true, data: res.data };
            }
        } catch (error: any) {
            logger.error(`[UserService.getAllUsers] Error fetching user details: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.getAllUsers] Error fetching user details: ${error.message}`);
        }
    }

    async updateUser(userId: string, userData: any): Promise<any> {
        try {
            const res = await this.userRepository.update(userId, userData);
            if (!res || res.success === false) {
                logger.warn(`[UserService.updateUser] Error updating user: ${JSON.stringify(res)}`);
                return { success: false, message: "User update failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[UserService.updateUser] Error updating user: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[UserService.updateUser] Error updating user: ${error.message}`);
        }
    }

    async getUserById(userId: string): Promise<any> {
        try {
            const res = await this.userRepository.findById(userId);
            console.log(res);
            if (!res || res.success === false) {
                logger.warn(`[UserService.getUserById] Error fetching user by ID: ${JSON.stringify(res)}`);
                return { success: false, message: "User not found" };
            } else {
                if (res.data.length === 0) {
                    logger.warn(`[UserService.getUserById] No user found with ID: ${userId}`);
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
                logger.warn(`[UserService.getUserByEmail] Error fetching user by email: ${JSON.stringify(res)}`);
                return { success: false, message: "User not found" };
            }
            if (res.data.length === 0) {
                logger.warn(`[UserService.getUserByEmail] No user found with email: ${email}`);
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