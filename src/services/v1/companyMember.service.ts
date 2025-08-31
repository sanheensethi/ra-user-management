import { dbCompanyMemberFactory } from "../../factory/db/dbCompanyMember.factory";
import logger from "../../logger/v1/logger";
import { CompanyMemberRepository } from "../../repository/v1/companyMember.repository";

class CompanyMemberService {
    private static instance: CompanyMemberService;
    private companyMemberRepository: CompanyMemberRepository;

    constructor() {
        this.companyMemberRepository = new CompanyMemberRepository();
    }

    async createCompanyMember(companyMemeberData: any) {
        try {
            let dbCompanyMember = dbCompanyMemberFactory(companyMemeberData);
            const res = await this.companyMemberRepository.create(dbCompanyMember);
            if (!res || res.success === false) {
                logger.error(`[CompanyMemberService.createCompanyMember] Company member creation failed for data: ${JSON.stringify(companyMemeberData)} | Response: ${JSON.stringify(res)}`);
                return { success: false, message: "Company Member creation failed" };
            } else {
                return { success: true, data: res.data[0] };
            }
        } catch (error: any) {
            logger.error(`[CompanyMemberService.createCompany] Error creating company: ${error.message} | Stack Trace: ${error.stack}`);
            throw new Error(`[CompanyMemberService.createCompany] Error creating company: ${error.message}`);
        }
    }

    async getCompanyId(userId: number) {
        try {
            const res = await this.companyMemberRepository.findByUserId(userId);
            if (!res || res.success === false) {
                logger.error(`[CompanyMemberService.getCompanyId] Error fetching company ID for user ID: ${userId} | Response: ${JSON.stringify(res)}`);
                return { success: false, message: "Company ID not found" };
            } else {
                return { success: true, data: res.data[0].company_id };
            }
        } catch (error: any) {
            logger.error(`[CompanyMemberService.getCompanyId] Error fetching company ID for user ID: ${userId} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Company ID not found" };
        }
    }

    async getCompanyMembersByCompanyId(companyId: number, page: number, limit: number) {
        try {
            const res = await this. companyMemberRepository.findAllPaginated(
                { company_id: "eq." + companyId },
                ["id,role_in_company,created_at, hired:user_id(id,name,email), hiredBy:hired_by(id,name,email)"],
                page,
                limit
            )
            if (!res || res.success === false) {
                logger.error(`[CompanyMemberService.getCompanyMembersByCompanyId] Error fetching company members for company ID: ${companyId} | Response: ${JSON.stringify(res)}`);
                return { success: false, message: "Company Members not found" };
            } else {
                return { success: true, data: res.data, pagination: res && 'pagination' in res ? res.pagination : undefined };
            }
        } catch (error: any) {
            logger.error(`[CompanyMemberService.getCompanyMembersByCompanyId] Error fetching company members for company ID: ${companyId} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Company Members not found" };
        }
    }

    public static getInstance(): CompanyMemberService {
        if (!CompanyMemberService.instance) {
            CompanyMemberService.instance = new CompanyMemberService();
        }
        return CompanyMemberService.instance;
    }

};

export default CompanyMemberService;