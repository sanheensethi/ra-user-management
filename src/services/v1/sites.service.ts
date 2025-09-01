import logger from "../../logger/v1/logger";
import { SitesRepository } from "../../repository/v1/sites.repository";


class SitesService {
    private static instance: SitesService;
    private siteRepository: SitesRepository;
    constructor() {
        this.siteRepository = new SitesRepository();
    }

    public static getInstance(): SitesService {
        if (!SitesService.instance) {
            SitesService.instance = new SitesService();
        }
        return SitesService.instance;
    }

    public async createSite(schemaData: any) {
        // schemaData should include user_id, company_id, schema_id, data
        try {
            const dbData = {
                user_id: schemaData.user_id,
                company_id: schemaData.company_id,
                schema_id: schemaData.schema_id,
                data: schemaData.data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const res = await this.siteRepository.create(dbData);
            if (!res || res.success === false) {
                logger.error(`[SitesService.createSite] creating site: ${JSON.stringify(res)} | dbData: ${JSON.stringify(dbData)}`);
                return { success: false, message: "Site not created" };
            }
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[SitesService.createSite] creating site: ${error.message} | Stack Trace: ${error.stack}`);
            throw error;
        }
    }


    public async getSiteSchemaByCompanyId(id: string, page: number = 1, limit: number = 10) {
        try {
            const res = await this.siteRepository.findAllPaginated({ company_id: "eq." + id }, ["*"], page, limit, "id.asc");
            if (!res || res.success === false) {
                logger.warn(`[SitesService.getSiteSchemaByCompanyId] getting site schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Site schema not found" };
            }
            return {
                success: true,
                data: res.data,
                pagination: res && 'pagination' in res ? res.pagination : undefined
            };
        } catch (error: any) {
            logger.error(`[SitesService.getSiteSchemaByCompanyId] getting site schema: ${error.message} | Stack Trace: ${error.stack}`);
            throw error;
        }
    }

}


export default SitesService;