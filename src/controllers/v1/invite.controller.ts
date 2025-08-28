import express, { Request, Response, Router } from "express";
import logger from "../../logger/v1/logger";
import InviteService from "../../services/v1/invite.service";
import { validateInvitationTypeInputs } from "../../utils/helpers";

class InviteController {
    private inviteService: InviteService;
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.inviteService = InviteService.getInstance();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/invite/create", this.createInvite.bind(this));
    }

    private async createInvite(req: Request, res: Response): Promise<Response> {
        try {
            // TODO: Replace with req.user?.id once auth middleware is implemented
            // invite_by_id = req.user?.id

            const { email, type, role_in_company, invited_by_id  } = req.body;

            // get the company_id from the user data, and this is only added by company owner Admin/ company manager

            if (!email || !type) {
                return res.status(400).json({ message: "Email and Type are required" });
            }

            const validation = validateInvitationTypeInputs(type, req.body);
            if (!validation.success) {
                return res.status(400).json({ message: validation.message });
            }

            let result;
            switch (type) {

                case "COMPANY_MEMBER":
                    result = await this.handleCompanyMemberInvite({ email, type, invited_by_id, role_in_company });
                    break;

                // If you want to add other invite types later (PLATFORM, COMPANY_MEMBER, etc.)
                default:
                    return res.status(400).json({ message: `Unsupported invite type: ${type}` });
            }

            if (result.success) {
                return res.status(201).json(result.data);
            }

            return res.status(500).json({ message: result.details || "Failed to create invitation" });

        } catch (error: any) {
            logger.error(`[InviteController.createInvite] Error: ${error.message} | Stack: ${error.stack}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async handleCompanyMemberInvite(params: {
        email: string;
        type: string;
        invited_by_id: number;
        role_in_company: string;
    }) {
        try {
            return await this.inviteService.createCompanyMemberInvite(params);
        } catch (error: any) {
            logger.error(`[InviteController.handleCompanyMemberInvite] Error: ${error.message} | Stack: ${error.stack}`);
            return { success: false, details: "Failed to create company member invitation" };
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default InviteController;
