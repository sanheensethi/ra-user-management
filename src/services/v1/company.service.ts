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

    async getAllCompanies(page:number, limit:number): Promise<any> {
        try {
            // Logic to fetch all companies from the database
            const offset = (page - 1) * limit;
            const res = await this.companyRepository.findAll(offset, limit);
            if (!res || res.success === false) {
                return { success: false, message: "No companies found" };
            } else {
                return { success: true, data: res.data };
            }
        } catch (error: any) {
            throw new Error(`[CompanyService.getAllCompanies] Error fetching company details: ${error.message}`);
        }
    }

    async createCompany(companyData: any): Promise<any> {
        try {
            // Logic to create a new company in the database
            const res = await this.companyRepository.create(companyData);
            if (!res || res.success === false) {
                return { success: false, message: "Company creation failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            throw new Error(`[CompanyService.createCompany] Error creating company: ${error.message}`);
        }
    }

    async updateCompany(companyId: string, companyData: any): Promise<any> {
        try {
            // Logic to update a company in the database
            const res = await this.companyRepository.update(companyId, companyData);
            if (!res || res.success === false) {
                return { success: false, message: "Company update failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            throw new Error(`[CompanyService.updateCompany] Error updating company: ${error.message}`);
        }
    }

}


export default CompanyService;