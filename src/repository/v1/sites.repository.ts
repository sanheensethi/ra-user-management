// repositories/user.repository.ts
import { getPagination } from "../../utils/pagination";
import { pgSelect, pgInsert, pgUpdate, pgDelete, pgPagination } from "./pgrest/postgrest";

export class SitesRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("sites", { ...filters, offset, limit, select });
  }

   async findAllPaginated(
        filters: Record<string, any> = {},
        select: string[] = ["*"],
        page: number = 1,
        limit: number = 10,
        order: string = "id.asc" // postgrest style: "column.asc|desc"
      ) {
        const offset = (Math.max(page, 1) - 1) * limit;
        const res = await pgPagination("sites", { ...filters, select, order, offset, limit });
        if (!res.success) return res;
    
        const pagination = getPagination(res.headers!, offset, limit);
        return { success: true, data: res.data, pagination: pagination };
      }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("sites", { id: "eq." + id, select });
  }

  async findByUserId(id: string, select: string[] = ["*"]) {
    return pgSelect("sites", { user_id: "eq." + id, select });
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
