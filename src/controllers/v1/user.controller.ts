import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import UserService from '../../services/v1/user.service';
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
        this.router.get('/user/:id', this.getUserById.bind(this));
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

    public getRouter() {
        return this.router;
    }

};

export default UserController;