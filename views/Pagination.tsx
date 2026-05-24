export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>上一页</button>
      <span>{page} / {Math.max(1, totalPages)}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>下一页</button>
    </div>
  );
}

