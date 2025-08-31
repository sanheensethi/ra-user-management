import { config } from "../../config/v1/config";
import { apiInviteFactory, apiInviteUserFactory } from "../../factory/api/apiInvite.factory";
import { dbCreateCompanyMemberInviteFactory } from "../../factory/db/dbInvite.factory";
import logger from "../../logger/v1/logger";
import { InviteRepository } from "../../repository/v1/invite.repository";
import CompanyService from "./company.service";
import CompanyMemberService from "./companyMember.service";

class InviteService {
    private static instance: InviteService;
    private inviteRepository: InviteRepository;
    private companyMemberService: CompanyMemberService;
    private companyService: CompanyService;

    constructor() {
        this.inviteRepository = new InviteRepository();
        this.companyMemberService = CompanyMemberService.getInstance();
        this.companyService = CompanyService.getInstance();
    }

    async getAllInvites(userId: number, page: number, limit: number) {
        try {

            // check company exist for current user ? YES -> get all invites of the company
            const companyData = await this.companyService.getCompanyByOwnerId(userId);
            let companyId = null;
            if (companyData.success) {
                logger.info("[InviteService.getAllInvites] Company exists for this user");
                // for contractor and owner, company always exists for them.
                companyId = companyData.data.id;
            } else {
                logger.info("[InviteService.getAllInvites] Company does not exist for this user");
                // it means, current user is either ADMIN / Manager of the company other then owner
                // get the company id from the company members
                const companyMemberResult = await this.companyMemberService.getCompanyId(userId);
                if (!companyMemberResult || companyMemberResult.success === false) {
                    logger.error(`[InviteService.getAllInvites] Error fetching company ID for user ID: ${userId} | Response: ${JSON.stringify(companyMemberResult)}`);
                    return { success: false, message: "Company ID not found" };
                }
                companyId = companyMemberResult.data.company_id;
            }
            const res = await this.inviteRepository.findAllPaginated({company_id: `eq.${companyId}`}, ["*, users(*)"], page, limit);
            if (!res || res.success === false) {
                logger.error(`[InviteService.getAllInvites] Error fetching invite details: ${JSON.stringify(res)}`);
                return { success: false, message: "No invites found" };
            } else {
                let inviteData = res.data.map((invite: any) => apiInviteUserFactory(invite));
                console.log(inviteData);
                logger.info("[InviteService.getAllInvites] Invites fetched successfully", JSON.stringify('pagination' in res ? JSON.stringify(res.pagination) : ''));
                return { success: true, data: inviteData, pagination: res && 'pagination' in res ? res.pagination : undefined };
            }
        } catch (error: any) {
            logger.error(`[InviteService.getAllInvites] Error fetching invite details: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, message: "No invites found" };
        }
    }

    async getInvitesByCode(code: string) {
        try {
            const invites = await this.inviteRepository.findByCode(code);
            if (invites.success && invites.data && invites.data.length > 0) {
                return { success: true, data: invites.data[0] }; // Return the first matching invite
            } else {
                logger.warn(`[InviteService.getInvitesByCode] No invite found with code: ${code}`);
                return { success: false, details: "Invite not found" };
            }
        } catch (error: any) {
            logger.error(`[InviteService.getInvitesByCode] fetching invite by code: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, details: "Internal Server Error" };
        }
    }

    async createCompanyMemberInvite(data: {
        email: string;
        type: string;
        invited_by_id: number;
        role_in_company: string;
    }): Promise<{ success: boolean; data?: any; details?: string }> {
        try {
            const { email, type, invited_by_id, role_in_company } = data;

            // get the company id from company service as the invited by id is owner.
            const companyData = await this.companyService.getCompanyByOwnerId(invited_by_id);
            let company_id = null;
            if (companyData.success) {
                logger.info("[InviteService.getAllInvites] Company exists for this user");
                // for contractor and owner, company always exists for them.
                company_id = companyData.data.id;
            } else {
                logger.info("[InviteService.getAllInvites] Company does not exist for this user");
                // it means, current user is either ADMIN / Manager of the company other then owner
                // get the company id from the company members
                const companyMemberResult = await this.companyMemberService.getCompanyId(invited_by_id);
                if (!companyMemberResult || companyMemberResult.success === false) {
                    logger.error(`[InviteService.getAllInvites] Error fetching company ID for user ID: ${invited_by_id} | Response: ${JSON.stringify(companyMemberResult)}`);
                    return { success: false, details: "Company ID not found" };
                }
                company_id = companyMemberResult.data.company_id;
            }

            logger.info(`[InviteService.createInvite] Creating invitation for email: ${email}, Company ID: ${company_id}`);

            // Prepare invitation data
            const invitationData = dbCreateCompanyMemberInviteFactory({ email, type, company_id, invited_by_id, role_in_company });

            // Save the invitation to the database
            const result = await this.inviteRepository.create(invitationData);
            if (result && result.data && result.data.length > 0) {

                let apiData = apiInviteFactory(result.data[0]);
                const findResult = await this.inviteRepository.findById(apiData.id, ["*,users(id,name)"]);
                if (findResult && findResult.success && findResult.data && findResult.data.length > 0) {
                    apiData = apiInviteUserFactory(findResult.data[0]);
                }
                
                // TODO: after this, put the task into email queue to send the invitation email
                // get the invite link from config
                const inviteLink = config['inviteLinkFrontendUrl'] + invitationData.invite_code;
                logger.info(`[InviteService.createInvite] Invitation created successfully for email: ${email}, Invite Link: ${inviteLink}`);
                console.log(`Invitation created successfully for email: ${email}, Invite Link: ${inviteLink}`);
                return { success: true, data: apiData};
            } else {
                logger.error(`[InviteService.createInvite] Failed to create invitation for email: ${email} | Result: ${JSON.stringify(result)}`);
                return { success: false, details: "Failed to create invitation" };
            }
        } catch (error: any) {
            logger.error(`[InviteService.createInvite] creating invite: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, details: "Internal Server Error" };
        }
    }

    async acceptInvite(inviteId: number, user_id: number, companyId: number, roleInCompany: number, hiredById: number) {
        try {
            let companyMemberResult = await this.companyMemberService.createCompanyMember({
                company_id: companyId,
                user_id: user_id,
                role_in_company: roleInCompany,
                hired_by: hiredById
            });
            if (!companyMemberResult || companyMemberResult.success === false) {
                logger.error(`[UserService.createUserWithInvite] Adding company member failed for user id: ${user_id} with role: ${roleInCompany} and company id: ${companyId}`);
                return { success: false, message: "Failed to accept the invite." };
            }

            let updateInvitesResult = await this.updateInviteById(inviteId, { 
                status: "ACCEPTED", 
                accepted_at: new Date().toISOString(), 
                updated_at: new Date().toISOString() 
            });
            if (!updateInvitesResult || updateInvitesResult.success === false) {
                logger.error(`[UserService.createUserWithInvite] Failed to delete invite for invite id: ${inviteId} | Result: ${JSON.stringify(updateInvitesResult)}`);
                return { success: false, message: "Invite Accepted, but Invite Status not updated" };
            }

            return { success: true, message: "Invite Accepted" };
        } catch (error: any) {
            logger.error(`[UserService.createUserWithInvite] accepting invite: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Internal Server Error" };
        }
    }

    async updateInviteById(id: number, updateData: any) {
        try {
            const updateResult = await this.inviteRepository.update(id, updateData);
            if (updateResult.success) {
                return { success: true, data: updateResult.data[0] };
            } else {
                logger.error(`[InviteService.updateInviteByCode] Failed to update invite with code: ${id} | Update Result: ${JSON.stringify(updateResult)}`);
                return { success: false, details: "Failed to update invite" };
            }
        } catch (error: any) {
            logger.error(`[InviteService.updateInviteByCode] updating invite by code: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, details: "Internal Server Error" };
        }
    }

    public static getInstance(): InviteService {
        if (!InviteService.instance) {
            InviteService.instance = new InviteService();
        }
        return InviteService.instance;
    }

};

export default InviteService;