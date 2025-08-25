// repositories/user.repository.ts
import { SiteSchema } from "../../interface/siteschema.interface";
import { pgSelect, pgInsert, pgUpdate, pgDelete } from "./pgrest/postgrest";

export class SiteSchemaRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("site_schema", { ...filters, offset, limit, select });
  }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("site_schema", { id: "eq." + id, select });
  }

  async findByCompanyId(id: string, select: string[] = ["*"]) {
    return pgSelect("site_schema", { company_id: "eq." + id, select });
  }

  async findActiveByCompanyId(id: string, select: string[] = ["*"]) {
    return pgSelect("site_schema", { company_id: "eq." + id, active: "eq.true", select });
  }

  async create(siteSchemaData: Omit<SiteSchema, "id">) {
    return pgInsert("site_schema", siteSchemaData);
  }

  async update(id: string, siteSchemaData: Partial<SiteSchema>) {
    return pgUpdate("site_schema", { id: "eq." + id }, siteSchemaData);
  }

  async delete(id: string) {
    return pgDelete("site_schema", { id: "eq." + id });
  }
}
