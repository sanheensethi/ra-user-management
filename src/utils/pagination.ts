export interface PaginationMeta {
  total: number;
  page: number;
  total_pages: number;
  page_size: number;
}

export function getPagination(headers: Headers, offset = 0, limit = 10): PaginationMeta {
  const contentRange = headers.get("Content-Range"); // "0-9/125"
  const match = contentRange?.match(/(\d+)-(\d+)\/(\d+|\*)/);

  const total = match && match[3] !== "*" ? parseInt(match[3], 10) : 0;
  const page = Math.floor(offset / Math.max(limit, 1)) + 1;
  const total_pages = total > 0 ? Math.ceil(total / Math.max(limit, 1)) : 0;

  return { total, page, total_pages, page_size: limit };
}