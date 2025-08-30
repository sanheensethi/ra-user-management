// repositories/user.repository.ts
import { getPagination } from "../../utils/pagination";
import { pgSelect, pgInsert, pgUpdate, pgDelete, pgPagination } from "./pgrest/postgrest";

export class InviteRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("invites", { ...filters, offset, limit, select });
  }

  async findAllPaginated(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    page: number = 1,
    limit: number = 10,
    order: string = "id.asc" // postgrest style: "column.asc|desc"
  ) {
    const offset = (Math.max(page, 1) - 1) * limit;
    const res = await pgPagination("invites", { ...filters, select, order, offset, limit });
    if (!res.success) return res;

    const pagination = getPagination(res.headers!, offset, limit);
    return { success: true, data: res.data, pagination: pagination };
  }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("invites", { id: "eq." + id, select });
  }

  async findByInvitedBy(invitedById: number, select: string[] = ["*"]) {
    return pgSelect("invites", { invited_by: "eq." + invitedById, select });
  }

  async findByCode(code: string, select: string[] = ["*"]) {
    return pgSelect("invites", { invite_code: "eq." + code, select });
  }

  async findByInvitationType(type: string, select: string[] = ["*"]) {
    return pgSelect("invites", { invitation_type: "eq." + type, select });
  }

  async create(invitationData: any) {
    return pgInsert("invites", invitationData);
  }

  async update(id: number, invitationData: any) {
    return pgUpdate("invites", { id: "eq." + id }, invitationData);
  }

  async delete(id: string) {
    return pgDelete("invites", { id: "eq." + id });
  }
}
