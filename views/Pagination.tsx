type PaginationItem = number | "ellipsis";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const currentPage = clampPage(page, safeTotalPages);
  const pages = paginationItems(currentPage, safeTotalPages);

  if (safeTotalPages <= 1) {
    return null;
  }

  function changePage(nextPage: number) {
    onPageChange(nextPage);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return (
    <nav className="pagination" aria-label="分页导航">
      <button disabled={currentPage <= 1} onClick={() => changePage(1)}>
        首页
      </button>
      <button disabled={currentPage <= 1} onClick={() => changePage(currentPage - 1)}>
        上一页
      </button>
      <div className="pagination-pages">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span className="pagination-ellipsis" key={`ellipsis-${index}`} aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              className={item === currentPage ? "active" : undefined}
              key={item}
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => changePage(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <button disabled={currentPage >= safeTotalPages} onClick={() => changePage(currentPage + 1)}>
        下一页
      </button>
      <button disabled={currentPage >= safeTotalPages} onClick={() => changePage(safeTotalPages)}>
        末页
      </button>
    </nav>
  );
}

function paginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages]);
  const start = Math.max(2, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  for (let item = start; item <= end; item += 1) {
    pages.add(item);
  }

  const sortedPages = Array.from(pages).sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  sortedPages.forEach((item, index) => {
    const previous = sortedPages[index - 1];
    if (previous && item - previous > 1) {
      items.push("ellipsis");
    }
    items.push(item);
  });

  return items;
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(1, page), totalPages);
}




