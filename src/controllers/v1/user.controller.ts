import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import UserService from '../../services/v1/user.service';
import { apiUserFactory } from '../../factory/api/apiUserFactory';
import InviteService from '../../services/v1/invite.service';

class UserController {
    private userService: UserService;
    private inviteService: InviteService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.userService = UserService.getInstance();
        this.inviteService = InviteService.getInstance();
    }

    private initializeRoutes() {
        this.router.get('/user', this.getAllUsers.bind(this));
        this.router.get('/user/:id', this.getUserById.bind(this));
        // TODO: Complete below
        this.router.post('/user/accept/:inviteCode', this.acceptInviteCode.bind(this));
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

    async acceptInviteCode(req: Request, res: Response) {
        // current user is already in database, so we have to get the user id from the request token
        // req.user?.id

        // TODO: implement the logic to accept the invite code
        // no need to add the user to the database, just accept invite, and add company member -> role in company

        const inviteCode = req.params.inviteCode;
        if (!inviteCode) {
            res.status(400).json({ message: "Invite code is required" });
            return;
        }
        
        const { user_id } = req.body; // TODO: this user aready exists in database, when token middleware is added, remove this and take user_id from req.body

        let inviteData = await this.inviteService.getInvitesByCode(inviteCode);

        // TOKEN: the user detail we can get from the token
        let userData = await this.userService.getUserById(user_id);

        logger.info(`Invite Data: ${JSON.stringify(inviteData)}`); // TODO: Remove this

        if (!inviteData || !inviteData.success) {
            res.status(400).json({ message: "Invalid invite code" });
            return;
        }

        if (inviteData.data.email !== userData.data.email) { // TODO: this data will receive from token
            res.status(400).json({ message: "Invite code does not match email" });
            return;
        }

        const inviteType = inviteData.data.invitation_type;
        
        if (inviteType == "COMPANY_MEMBER") {
            const companyId = inviteData.data.company_id;
            const roleInCompany = inviteData.data.role_in_company;
            const hiredById = inviteData.data.invited_by;
            const result = await this.inviteService.acceptInvite(inviteData.data.id, user_id, companyId, roleInCompany, hiredById);

            if (result.success) {
                res.status(200).json({ message: result.message });
                return;
            } else {
                res.status(400).json({ message: result.message });
                return;
            }
        } else {
            res.status(400).json({ message: "Invalid invite code" });
            return;
        }

    }

    public getRouter() {
        return this.router;
    }

};

export default UserController;