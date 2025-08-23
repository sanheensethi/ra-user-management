import express, { Request, Response } from 'express';
import logger from '../../logger/logger';
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
        this.router.post('/company', this.createCompany.bind(this));
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

    private async createCompany(req: Request, res: Response) {
        try {
            const companyData = req.body;
            // Logic to create a new company
            const result = await this.companyService.createCompany(companyData);
            if (result.success) {
                res.status(201).json(result.data);
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error: any) {
            logger.error(`[CompanyController.createCompany] creating company: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }



    public getRouter() {
        return this.router;
    }

}

export default CompanyController;