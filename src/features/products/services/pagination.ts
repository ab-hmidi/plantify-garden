export const PRODUCTS_PER_PAGE = 12;

export function parsePageNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function getPageWindow(
  requestedPage: number,
  total: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  return {
    page,
    totalPages,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
