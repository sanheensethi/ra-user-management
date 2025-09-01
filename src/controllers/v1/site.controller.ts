import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import SitesService from '../../services/v1/sites.service';
import CompanyService from '../../services/v1/company.service';

class SiteController {
    private siteService: SitesService;
    private companyService: CompanyService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.siteService = SitesService.getInstance();
        this.companyService = CompanyService.getInstance();
    }

    private initializeRoutes() {
        this.router.post('/sites', this.createSite.bind(this));
        this.router.get('/sites', this.getSites.bind(this));
    }

    private async createSite(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            let { schema_id, data } = req.body;

            // get the company id from user id
            let companyResult = await this.companyService.getCompanyByOwnerId(userId);
            let company_id = null;
            if (companyResult.success) {
                company_id = companyResult.data.id;
            } else {
                logger.error(`[SiteController.createSite] getting company id: ${companyResult.message}`);
                res.status(400).json({ message: companyResult.message });
                return;
            }
            let siteData = await this.siteService.createSite({ user_id: userId, company_id, schema_id, data });
            if (siteData.success) {
                res.status(200).json({"message": "Site created successfully", "data": siteData.data});
            } else {
                logger.error(`[SiteController.createSite] creating site: ${siteData.message}`);
                res.status(400).json({ message: siteData.message });
            }
        } catch (error: any) {
            logger.error(`[SiteController.createSite] creating site : ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getSites(req: Request, res: Response ) {
        try {
            const userId = req.user?.id;
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 10;
            let companyResult = await this.companyService.getCompanyByOwnerId(userId);
            let company_id = null;
            if (companyResult.success) {
                company_id = companyResult.data.id;
            } else {
                // current user can be manager/admin but not owner
                logger.error(`[SiteController.getSites] getting company id: ${companyResult.message}`);
                res.status(400).json({ message: companyResult.message });
                return;
            }
            let data = await this.siteService.getSiteSchemaByCompanyId(company_id, page, limit);
            if (data.success) {
                res.status(200).json({"message": "Sites fetched successfully", "data": data.data, pagination: data.pagination});
            } else {
                logger.error(`[SiteController.getSites] getting sites: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[SiteController.getSites] getting sites: ${error.message} | Stack Trace: ${error.stack}`);   
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    public getRouter() {
        return this.router;
    }

}

export default SiteController;