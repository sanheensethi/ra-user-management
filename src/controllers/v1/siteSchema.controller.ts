import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import SiteSchemaService from '../../services/v1/siteSchema.service';
import CompanyService from '../../services/v1/company.service';

class SiteSchemaController {
    private siteSchemaService: SiteSchemaService;
    private companyService: CompanyService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.siteSchemaService = SiteSchemaService.getInstance();
        this.companyService = CompanyService.getInstance();
    }

    private initializeRoutes() {
        this.router.post('/site-schema', this.createSiteSchema.bind(this));
        this.router.get('/site-schema/names', this.getAllSiteSchemaNames.bind(this));
        this.router.get('/site-schema/:id', this.getSiteSchemaById.bind(this));
        this.router.get('/site-schema/company/:id', this.getSiteSchemaByCompanyId.bind(this));
    }

    private async getAllSiteSchemaNames(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            let company_id = null;
            // get the company id from user id
            let companyResult = await this.companyService.getCompanyByOwnerId(userId);
            console.log(companyResult);
            if (companyResult.success) {
                company_id = companyResult.data.id;
            } else {
                logger.error(`[SiteSchemaController.createSiteSchema] getting company id: ${companyResult.message}`);
                res.status(400).json({ message: companyResult.message });
                return;
            }
            console.log(company_id);
            let data = await this.siteSchemaService.getAllSchemaNames(company_id);
            if (data.success) {
                res.status(200).json({"message": "Site schema fetched successfully", "data": data.data});
            } else {
                logger.error(`[SiteSchemaController.getAllSiteSchema] getting site schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[SiteSchemaController.getAllSiteSchema] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async createSiteSchema(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            let { schema_name, is_active, schema } = req.body;
            if (!is_active) is_active = true;

            // get the company id from user id
            let companyResult = await this.companyService.getCompanyByOwnerId(userId);
            let company_id = null;
            if (companyResult.success) {
                company_id = companyResult.data.id;
            } else {
                logger.error(`[SiteSchemaController.createSiteSchema] getting company id: ${companyResult.message}`);
                res.status(400).json({ message: companyResult.message });
                return;
            }
            let data = await this.siteSchemaService.createSiteSchema({ schema_name, is_active, company_id, schema });
            if (data.success) {
                res.status(200).json({"message": "Site schema created successfully", "data": data.data});
            } else {
                logger.error(`[SiteSchemaController.createSiteSchema] creating site schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[SiteSchemaController.createSiteSchema] creating site schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getSiteSchemaById(req: Request, res: Response) {
        try {
            let { id } = req.params;
            let data = await this.siteSchemaService.getSiteSchemaById(id);
            if (data.success) {
                res.status(200).json({data: data.data});
            } else {
                logger.error(`[SiteSchemaController.getSiteSchemaById] getting site schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[SiteSchemaController.getSiteSchemaById] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getSiteSchemaByCompanyId(req: Request, res: Response) {
        try {
            let { id } = req.params;
            let data = await this.siteSchemaService.getSiteSchemaByCompanyId(id);
            if (data.success) {
                res.status(200).json({data: data.data});
            } else {
                logger.error(`[SiteSchemaController.getSiteSchemaByCompanyId] getting site schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[SiteSchemaController.getSiteSchemaByCompanyId] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    public getRouter() {
        return this.router;
    }

}

export default SiteSchemaController;