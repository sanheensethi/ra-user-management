

export function apiInviteFactory(dbData: any) {
    return {
        id: dbData.id,
        code: dbData.code,
        email: dbData.email,
        invite_code: dbData.invite_code,
        invitation_type: dbData.invitation_type,
        invited_by: dbData.invited_by,
        role_in_company: dbData.role_in_company,
        status: dbData.status,
        expired_at: dbData.expired_at,
        base_price_up: dbData.base_price_up,
        accepted_at: dbData.accepted_at,
        created_at: dbData.created_at,
        updated_at: dbData.updated_at
    }
}

export function apiInviteUserFactory(dbData: any) {
    return {
        id: dbData.id,
        code: dbData.code,
        email: dbData.email,
        invite_code: dbData.invite_code,
        company_id: dbData.company_id,
        invitation_type: dbData.invitation_type,
        invited_by: dbData.invited_by,
        invited_by_name: dbData.users.name,
        role_in_company: dbData.role_in_company,
        status: dbData.status,
        expired_at: dbData.expired_at,
        base_price_up: dbData.base_price_up,
        accepted_at: dbData.accepted_at,
        created_at: dbData.created_at,
        updated_at: dbData.updated_at
    }
}