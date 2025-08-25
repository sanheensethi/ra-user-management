import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import SiteSchemaService from '../../services/v1/siteSchema.service';

class SiteSchemaController {
    private siteSchemaService: SiteSchemaService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.siteSchemaService = SiteSchemaService.getInstance();
    }

    private initializeRoutes() {
        this.router.post('/site-schema', this.createSiteSchema.bind(this));
        this.router.get('/site-schema/:id', this.getSiteSchemaById.bind(this));
        this.router.get('/site-schema/company/:id', this.getSiteSchemaByCompanyId.bind(this));
    }

    private async createSiteSchema(req: Request, res: Response) {
        try {
            let { schema_name, is_active, company_id, schema } = req.body;
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