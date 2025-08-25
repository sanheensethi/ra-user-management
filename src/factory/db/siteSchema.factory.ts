import { SiteSchema } from "../../interface/siteschema.interface";

export const dbNewSiteSchemaFactory = (data: Omit<SiteSchema, 'id' | 'created_at' | 'updated_at'>): Omit<SiteSchema, 'id'> => {
    return {
        company_id: data.company_id,
        is_active: data.is_active,
        schema_name: data.schema_name,
        schema: data.schema,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
    }
}