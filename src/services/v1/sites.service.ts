import logger from "../../logger/v1/logger";
import { CompanyRepository } from "../../repository/v1/company.repository";


class SitesService {
    private static instance: SitesService;
    private companyRepository: CompanyRepository;
    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    public static getInstance(): SitesService {
        if (!SitesService.instance) {
            SitesService.instance = new SitesService();
        }
        return SitesService.instance;
    }

}


export default SitesService;