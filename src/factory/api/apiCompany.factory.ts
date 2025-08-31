export function apiCompanyUserFactory(dbData: any) {
    return {
        id: dbData.id,
        name: dbData.name,
        created_at: dbData.created_at,
        updated_at: dbData.updated_at,
        company_owner_name: dbData.users.name
    }
}