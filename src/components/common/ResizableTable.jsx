import { useState, useCallback } from 'react';

/**
 * ResizableTable
 *
 * Props:
 *   columns  : Array<{ key, label, width?, sortable?, align?, render? }>
 *   data     : Array<object>
 *   emptyText: string (optional)
 *
 * 기능:
 *   - 헤더 클릭 → 오름차순(▲) / 내림차순(▼) 정렬 토글
 *   - 헤더 우측 경계 드래그 → 컬럼 너비 조절 (최소 50px)
 */
export default function ResizableTable({ columns, data, emptyText = '조회 결과가 없습니다.' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [colWidths, setColWidths] = useState({});

  // ── 정렬 ──────────────────────────────────────────────────────────────────
  function handleHeaderClick(col) {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        let cmp = 0;
        if (typeof va === 'number' && typeof vb === 'number') {
          cmp = va - vb;
        } else {
          cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'ko');
        }
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  // ── 컬럼 리사이즈 ─────────────────────────────────────────────────────────
  const handleResizeMouseDown = useCallback((e, colKey, defaultWidth) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startW = colWidths[colKey] ?? defaultWidth ?? 100;

    function onMove(ev) {
      const next = Math.max(50, startW + ev.clientX - startX);
      setColWidths(w => ({ ...w, [colKey]: next }));
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [colWidths]);

  // ── 렌더 ──────────────────────────────────────────────────────────────────
  return (
    <table style={{ tableLayout: 'fixed', width: '100%' }}>
      <colgroup>
        {columns.map(col => (
          <col
            key={col.key}
            style={{ width: colWidths[col.key] ?? col.width ?? 'auto' }}
          />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map(col => {
            const isActive = sortKey === col.key;
            return (
              <th
                key={col.key}
                onClick={() => handleHeaderClick(col)}
                style={{
                  position: 'relative',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  textAlign: col.align ?? 'left',
                  whiteSpace: 'nowrap',
                  paddingRight: 18,   // 리사이즈 핸들 공간
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  {col.label}
                  {col.sortable && (
                    <span style={{
                      fontSize: 9,
                      color: isActive ? 'var(--purple-800)' : 'var(--gray-300)',
                      lineHeight: 1,
                    }}>
                      {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  )}
                </span>

                {/* 리사이즈 핸들 */}
                <span
                  onMouseDown={e => handleResizeMouseDown(e, col.key, colWidths[col.key] ?? col.width ?? 100)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 6,
                    cursor: 'col-resize',
                    zIndex: 1,
                    background: 'transparent',
                  }}
                />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 32 }}
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          sorted.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{ textAlign: col.align ?? 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
