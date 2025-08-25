import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import CompanyService from '../../services/v1/company.service';

class CompanyController {
    private companyService: CompanyService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.companyService = CompanyService.getInstance();
    }

    private initializeRoutes() {
        this.router.get('/company', this.getAllCompany.bind(this));
    }

    private async getAllCompany(req: Request, res: Response) {
        try {
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            // Logic to get company details
            let data = await this.companyService.getAllCompanies(page, limit);
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