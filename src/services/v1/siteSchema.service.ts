import { dbNewSiteSchemaFactory } from "../../factory/db/siteSchema.factory";
import logger from "../../logger/v1/logger";
import { SiteSchemaRepository } from "../../repository/v1/siteSchema.repository";


class SiteSchemaService {
    private static instance: SiteSchemaService;
    private siteSchemaRepository: SiteSchemaRepository;
    constructor() {
        this.siteSchemaRepository = new SiteSchemaRepository();
    }

    public static getInstance(): SiteSchemaService {
        if (!SiteSchemaService.instance) {
            SiteSchemaService.instance = new SiteSchemaService();
        }
        return SiteSchemaService.instance;
    }

    public async getAllSchemaNames(company_id: string) {
        try {
            const res = await this.siteSchemaRepository.findAll({company_id: "eq." + company_id}, ["id, schema_name"], 0, 9999);
            console.log(res);   
            if (!res || res.success === false) {
                logger.warn(`[SiteSchemaService.getAllSiteSchema] getting site schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Site schema not found" };
            } 
            return { success: true, data: res.data };
        } catch (error: any) {
            logger.error(`[SiteSchemaService.getAllSiteSchema] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Site schema not found" };
        }
    }

    public async createSiteSchema(schemaData: any) {
        try {
            let dbData = dbNewSiteSchemaFactory(schemaData);
            const res = await this.siteSchemaRepository.create(dbData);
            if (!res || res.success === false) {
                logger.error(`[SiteSchemaService.createSiteSchema] creating site schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Site schema not created" };
            } 
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[SiteSchemaService.createSiteSchema] creating site schema: ${error.message} | Stack Trace: ${error.stack}`);
            throw error;
        }
    }

    public async getSiteSchemaById(id: string) {
        try {
            const res = await this.siteSchemaRepository.findById(id);
            if (!res || res.success === false) {
                logger.warn(`[SiteSchemaService.getSiteSchemaById] getting site schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Site schema not found" };
            } 
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[SiteSchemaService.getSiteSchemaById] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Site schema not found" };
        }
    }

    public async getSiteSchemaByCompanyId(id: string) {
        try {
            const res = await this.siteSchemaRepository.findByCompanyId(id);
            if (!res || res.success === false) {
                logger.warn(`[SiteSchemaService.getSiteSchemaByCompanyId] getting site schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Site schema not found" };
            } 
            return { success: true, data: res.data };
        } catch (error: any) {
            logger.error(`[SiteSchemaService.getSiteSchemaByCompanyId] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            throw error;
        }
    }

}


export default SiteSchemaService;