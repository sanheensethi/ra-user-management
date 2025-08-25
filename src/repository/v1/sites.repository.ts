// repositories/user.repository.ts
import { pgSelect, pgInsert, pgUpdate, pgDelete } from "./pgrest/postgrest";

export class SitesRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("sites", { ...filters, offset, limit, select });
  }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("sites", { id: "eq." + id, select });
  }

  async findByCompanyId(id: string, select: string[] = ["*"]) {
    return pgSelect("sites", { company_id: "eq." + id, select });
  }

  async findBySchemaId(id: string, select: string[] = ["*"]) {
    return pgSelect("sites", { schema_id: "eq." + id, select });
  }

  async create(siteData: any) {
    return pgInsert("sites", siteData);
  }

  async update(id: string, siteData: any) {
    return pgUpdate("sites", { id: "eq." + id }, siteData);
  }

  async delete(id: string) {
    return pgDelete("sites", { id: "eq." + id });
  }
}
