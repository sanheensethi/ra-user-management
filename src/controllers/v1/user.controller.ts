import express, { Request, Response } from 'express';
import logger from '../../logger/logger';
import UserService from '../../services/v1/user.service';
import { encryptPassword, isValidBaseRole } from '../../utils/helpers';
import { dbUserFactory } from '../../factory/db/dbUserFactory';
import { apiUserFactory } from '../../factory/api/apiUserFactory';

class UserController {
    private userService: UserService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.userService = UserService.getInstance();
    }

    private initializeRoutes() {
        this.router.get('/user', this.getAllUsers.bind(this));
        this.router.post('/user', this.createUser.bind(this));
        this.router.put('/user/:id', this.updateUser.bind(this));
        this.router.get('/user/:id', this.getUserById.bind(this));
        this.router.delete('/user/:id', this.deleteUser.bind(this));
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            // Logic to get user details
            let data = await this.userService.getAllUsers(page, limit);

            // do apiUserFactory to format the data for API response
            data.data = data.data.map((user: any) => apiUserFactory(user));

            if (data.success) {
                res.status(200).json(data.data);
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[UserController.getAllUsers] fetching user details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            let { name, email, password, base_role } = userData;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Name, Email, and Password are required" });
            }
            if (!base_role) {
                base_role = "COMPANY"; // Default to WORKER if not provided
            }
            if(!isValidBaseRole(base_role)) {
                return res.status(400).json({ message: "Invalid base_role" });
            }

            // Logic to create a new user
            const result = await this.userService.createUser({name, email, password, base_role});
            
            if (result.success) {
                const user_data = apiUserFactory((result.data)[0]); // Assuming result.data is an array
                res.status(201).json({"message": "User created successfully", data: user_data });
            } else {
                res.status(400).json({ message: result.details });
            }
        } catch (error: any) {
            logger.error(`[UserController.createUser] creating user: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id; // TODO: get this id from the token
            const userData = req.body;
            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }
            if (userData.password) {
                res.status(400).json({ message: "Password cannot be updated via this endpoint" });
                return;
            }
            if (userData.base_role && !isValidBaseRole(userData.base_role)) {
                return res.status(400).json({ message: "Invalid base_role" });
            }
            // Logic to update user details
            const result = await this.userService.updateUser(userId, userData);
            if (result.success) {
                const user_data = apiUserFactory((result.data)[0]); // Assuming result.data is an array
                res.status(200).json({ message: "User updated successfully", data: user_data });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error: any) {
            logger.error(`[UserController.updateUser] updating user: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id; // TODO: get this id from the token
            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }
            // Logic to get user details by ID
            const result = await this.userService.getUserById(userId);
            if (result.success) {
                const user_data = apiUserFactory(result.data); // Assuming result.data is an object
                res.status(200).json(user_data);
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error: any) {
            logger.error(`[UserController.getUserById] fetching user by ID: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id; // TODO: get this id from the token
            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }
            // Logic to delete user by ID
            const result = await this.userService.deleteUser(userId);
            if (result.success) {
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error: any) {
            logger.error(`[UserController.deleteUser] deleting user: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public getRouter() {
        return this.router;
    }

};

export default UserController;