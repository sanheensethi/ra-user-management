import { apiCompanyUserFactory } from "../../factory/api/apiCompany.factory";
import logger from "../../logger/v1/logger";
import { CompanyRepository } from "../../repository/v1/company.repository";


class CompanyService {
    private static instance: CompanyService;
    private companyRepository: CompanyRepository;
    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    public static getInstance(): CompanyService {
        if (!CompanyService.instance) {
            CompanyService.instance = new CompanyService();
        }
        return CompanyService.instance;
    }

    async getAllCompanies(userId: number, page:number, limit:number): Promise<any> {
        try {
            // Logic to fetch all companies from the database
            // ownedCompany
            const companies = {
                'ownedCompany': [], // i own
                'hiredByCompany': [], // i am hired
                'hiredCompany': [] // i hired others
            }
            const ownedCompanyRes = await this.getCompanyByOwnerId(userId);
            if (ownedCompanyRes.success) {
                companies.ownedCompany = ownedCompanyRes.data;
            }



            const offset = (page - 1) * limit;
            const res = await this.companyRepository.findAll({}, ["*"], offset, limit);
            if (!res || res.success === false) {
                logger.error(`[CompanyService.getAllCompanies] Error fetching company details: ${JSON.stringify(res)}`);
                return { success: false, message: "No companies found" };
            } else {
                return { success: true, data: res.data };
            }
        } catch (error: any) {
            logger.error(`[CompanyService.getAllCompanies] Error fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[CompanyService.getAllCompanies] Error fetching company details: ${error.message}`);
        }
    }

    async getCompanyByOwnerId(ownerId: number): Promise<any> {
        try {
            // Logic to fetch all companies from the database
            const res = await this.companyRepository.findCompanyByOwnerId(ownerId,["*, users(*)"]);
            if (!res || res.success === false) {
                logger.error(`[CompanyService.getCompanyByOwnerId] Error fetching company details: ${JSON.stringify(res)}`);
                return { success: false, message: "No companies found" };
            } else {
                return { success: true, data: apiCompanyUserFactory(res.data[0]) };
            }
        } catch (error: any) {
            logger.error(`[CompanyService.getCompanyByOwnerId] Error fetching company details: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[CompanyService.getCompanyByOwnerId] Error fetching company details: ${error.message}`);
        }
    }

    async updateCompany(companyId: string, companyData: any): Promise<any> {
        try {
            // Logic to update a company in the database
            const res = await this.companyRepository.update(companyId, companyData);
            if (!res || res.success === false) {
                logger.error(`[CompanyService.updateCompany] Error updating company: ${JSON.stringify(res)}`);
                return { success: false, message: "Company update failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[CompanyService.updateCompany] Error updating company: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[CompanyService.updateCompany] Error updating company: ${error.message}`);
        }
    }

}


export default CompanyService;