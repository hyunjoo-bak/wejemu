const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 300];

export default function Pagination({
  page,
  totalCount,
  pageSize = 10,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      gap: 8,
    }}>
      {/* 왼쪽: 페이지당 건수 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
        <span>페이지당</span>
        <select
          value={pageSize}
          onChange={e => {
            onPageSizeChange?.(Number(e.target.value));
            onPageChange?.(1);
          }}
          style={{ height: 28, padding: '0 6px', fontSize: 12 }}
        >
          {pageSizeOptions.map(s => (
            <option key={s} value={s}>{s}건</option>
          ))}
        </select>
      </div>

      {/* 가운데: 페이지 번호 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button className="btn btn-sm" onClick={() => onPageChange(1)}          disabled={page === 1}>«</button>
        <button className="btn btn-sm" onClick={() => onPageChange(page - 1)}   disabled={page === 1}>‹</button>
        {pages.map(p => (
          <button
            key={p}
            className="btn btn-sm"
            onClick={() => onPageChange(p)}
            style={p === page ? {
              background: 'var(--purple-800)',
              color: 'white',
              borderColor: 'var(--purple-800)',
            } : {}}
          >
            {p}
          </button>
        ))}
        <button className="btn btn-sm" onClick={() => onPageChange(page + 1)}        disabled={page === totalPages}>›</button>
        <button className="btn btn-sm" onClick={() => onPageChange(totalPages)}       disabled={page === totalPages}>»</button>
      </div>

      {/* 오른쪽: 조회결과 */}
      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
        조회결과&nbsp;<strong style={{ color: 'var(--color-text)' }}>{totalCount.toLocaleString()}</strong>건
      </div>
    </div>
  );
}
