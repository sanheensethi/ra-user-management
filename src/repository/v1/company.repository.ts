// repositories/company.repository.ts
import { pgSelect, pgInsert, pgUpdate, pgDelete } from "./pgrest/postgrest";

export class CompanyRepository {
  async findAll(
    offset: number,
    limit: number,
    filters: Record<string, any> = {},
    columns: string[] = []
  ) {
    const params: Record<string, any> = {
      offset,
      limit,
      ...filters,
    };
    if (columns.length > 0) {
      params.select = columns.join(",");
    }
    return pgSelect("companies", params);
  }

  async findById(id: string, columns: string[] = []) {
    const params: Record<string, any> = { id: "eq." + id };
    if (columns.length > 0) {
      params.select = columns.join(",");
    }
    return pgSelect("companies", params);
  }

  async create(companyData: any) {
    return pgInsert("companies", companyData);
  }

  async update(id: string, companyData: any) {
    return pgUpdate("companies", { id: "eq." + id }, companyData);
  }

  async delete(id: string) {
    return pgDelete("companies", { id: "eq." + id });
  }
}
