export default function Pagination({ page, totalCount, pageSize = 20, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '16px' }}>
      <button className="btn btn-sm" onClick={() => onPageChange(1)} disabled={page === 1}>«</button>
      <button className="btn btn-sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
      {pages.map(p => (
        <button
          key={p}
          className="btn btn-sm"
          onClick={() => onPageChange(p)}
          style={p === page ? { background: 'var(--purple-800)', color: 'white', borderColor: 'var(--purple-800)' } : {}}
        >
          {p}
        </button>
      ))}
      <button className="btn btn-sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
      <button className="btn btn-sm" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</button>
      <span style={{ fontSize: '12px', color: 'var(--gray-500)', marginLeft: '8px' }}>
        {totalCount.toLocaleString()}건
      </span>
    </div>
  );
}
