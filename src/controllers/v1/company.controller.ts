import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import CompanyService from '../../services/v1/company.service';
import CompanyMemberService from '../../services/v1/companyMember.service';

class CompanyController {
    private companyService: CompanyService;
    private companyMemberService: CompanyMemberService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.companyService = CompanyService.getInstance();
        this.companyMemberService = CompanyMemberService.getInstance();
    }

    private initializeRoutes() {
        this.router.get('/company', this.getCompany.bind(this)); // i own
        this.router.get('/company/hiredBy', this.getHiredBy.bind(this)); // i am hired
        this.router.get('/company/hired', this.getIHired.bind(this)); // i hired
        this.router.get('/company/hired/roles', this.getIHiredRoles.bind(this));
    }

    private async getCompany(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id) || 0;
            if (userId === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            // Logic to get company details
            let data = await this.companyService.getCompanyByOwnerId(userId);
            if (data.success) {
                res.status(200).json(data.data);
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.getCompany] fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getHiredBy(req: Request, res: Response) {
        // user_id in company_members table is the current user
        // get all data from company_members where user_id = req.user?.id
        // then get all comapny_id -> join to get all company data
        // and get the role in company and hired_by:int and it's name also

        try {
            const userId = Number(req.user?.id) || 0;
            if (userId === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            // Logic to get company details
            let data = await this.companyMemberService.getCompanyMemebrsByUserId(userId, page, limit);
            if (data.success) {
                res.status(200).json({data: data.data, pagination: data.pagination});
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.getHiredBy] fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }

    }

    private async getIHired(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id) || 0;
            if (userId === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            // Logic to get company details
            let data = await this.companyService.getCompanyByOwnerId(userId);
            if (data.success) {
                let company_id = data.data.id;
                // now get all company members based on company id
                data = await this.companyMemberService.getCompanyMembersByCompanyId(company_id, page, limit);
                if (data.success) {
                    res.status(200).json({data: data.data, pagination: data.pagination});
                } else {
                    res.status(400).json({ message: data.message });
                }
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.getIHired] fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getIHiredRoles(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id) || 0;
            if (userId === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            let { page = 1, limit = 10, role } = req.query;
            page = Number(page);
            limit = Number(limit);
            const roleStr = typeof role === 'string' ? role : '';
            // Logic to get company details
            let data = await this.companyService.getCompanyByOwnerId(userId);
            if (data.success) {
                let company_id = data.data.id;
                // now get all company members based on company id
                data = await this.companyMemberService.getCompanyMembersByCompanyIdWithRole(roleStr, company_id, page, limit);
                if (data.success) {
                    res.status(200).json({data: data.data, pagination: data.pagination});
                } else {
                    res.status(400).json({ message: data.message });
                }
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.getIHired] fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getAllCompany(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id) || 0;
            if (userId === 0) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            // Logic to get company details
            let data = await this.companyService.getAllCompanies(userId, page, limit);
            if (data.success) {
                res.status(200).json(data.data);
            } else {
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.getAllCompany] fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    public getRouter() {
        return this.router;
    }

}

export default CompanyController;