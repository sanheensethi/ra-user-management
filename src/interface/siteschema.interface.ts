export interface SiteSchema {
    id: number
    company_id: number
    is_active: boolean
    schema_name: string
    schema: any // allow parsed JSON object
    created_at: Date | string
    updated_at: Date | string
}