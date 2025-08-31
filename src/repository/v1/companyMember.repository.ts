// repositories/user.repository.ts
import { getPagination } from "../../utils/pagination";
import { pgSelect, pgInsert, pgUpdate, pgDelete, pgPagination } from "./pgrest/postgrest";

export class CompanyMemberRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("company_members", { ...filters, offset, limit, select });
  }

  async findAllPaginated(
      filters: Record<string, any> = {},
      select: string[] = ["*"],
      page: number = 1,
      limit: number = 10,
      order: string = "id.asc" // postgrest style: "column.asc|desc"
    ) {
      const offset = (Math.max(page, 1) - 1) * limit;
      const res = await pgPagination("company_members", { ...filters, select, order, offset, limit });
      if (!res.success) return res;
  
      const pagination = getPagination(res.headers!, offset, limit);
      return { success: true, data: res.data, pagination: pagination };
    }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("company_members", { id: "eq." + id, select });
  }

  async findByCompanyId(companyId: number, select: string[] = ["*"]) {
    return pgSelect("company_members", {
      company_id: "eq." + companyId,
      select,
    });
  }

  async findByUserId(userId: number, select: string[] = ["*"]) {
    return pgSelect("company_members", { user_id: "eq." + userId, select });
  }

  async findByCompanyIdAndUserId(
    companyId: number,
    userId: number,
    select: string[] = ["*"]
  ) {
    return pgSelect("company_members", {
      company_id: "eq." + companyId,
      user_id: "eq." + userId,
      select,
    });
  }

  async findByHiredBy(hiredById: number, select: string[] = ["*"]) {
    return pgSelect("company_members", { hired_by: "eq." + hiredById, select });
  }

  async create(companyData: any) {
    return pgInsert("company_members", companyData);
  }

  async update(id: string, companyData: any) {
    return pgUpdate("company_members", { id: "eq." + id }, companyData);
  }

  async delete(id: string) {
    return pgDelete("company_members", { id: "eq." + id });
  }
}
