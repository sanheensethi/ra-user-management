
import tokenService from "../../utils/tokens";

export function dbCreateCompanyMemberInviteFactory(data: any) {
    let { email, type, company_id, invited_by_id, role_in_company } = data;
    
    return {
        email: email,
        invite_code: tokenService.generateRandomToken(16),
        invitation_type: type,
        invited_by: invited_by_id,
        company_id: company_id,
        role_in_company: role_in_company,
        status: "PENDING",
        expire_time: new Date(new Date().getTime() + 7*24*60*60*1000).toISOString(), // 7 days from now
        base_price_up: 0.20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}