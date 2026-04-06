import { useState } from 'react';
import { MOCK_BIZ_ACCOUNTS } from '../../data/mockBusinesses';
import Badge from '../../components/common/Badge';
import SearchPanel from '../../components/common/SearchPanel';
import ResizableTable from '../../components/common/ResizableTable';

const BIZ_ADMIN_COLUMNS = [
  { key: 'bizNo',       label: '사업자번호',   width: 120, sortable: true },
  { key: 'companyName', label: '사업장명',     width: 160, sortable: true,
    render: a => <span style={{ fontWeight: 600 }}>{a.companyName}</span> },
  { key: 'name',        label: '이름',         width: 90,  sortable: true },
  { key: 'email',       label: '아이디(이메일)', width: 180, sortable: true },
  { key: 'joinDate',    label: '가입일자',     width: 100, sortable: true },
  { key: 'status',      label: '상태',         width: 80,  sortable: true, render: a => <Badge value={a.status} /> },
  { key: '_manage',     label: '관리',         width: 70,  sortable: false,
    render: () => <button className="btn btn-sm" style={{ color: 'var(--blue-600)' }}>상세</button> },
];

const DATE_TYPES     = ['등록일자', '해지일자'];
const STATUS_OPTIONS = ['전체', '정상', '해지', '삭제'];
const SEARCH_TARGETS = ['이름', '아이디', '사업자번호', '사업장명'];

export default function BizAdminPage() {
  const [dateType,     setDateType]     = useState('등록일자');
  const [fromDate,     setFromDate]     = useState('');
  const [toDate,       setToDate]       = useState('');
  const [status,       setStatus]       = useState('전체');
  const [searchTarget, setSearchTarget] = useState('이름');
  const [searchKw,     setSearchKw]     = useState('');
  const [filtered,     setFiltered]     = useState(MOCK_BIZ_ACCOUNTS);

  function handleSearch() {
    let result = [...MOCK_BIZ_ACCOUNTS];

    if (status !== '전체') {
      result = result.filter(a => a.status === status);
    }

    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase();
      if (searchTarget === '이름')       result = result.filter(a => a.name.toLowerCase().includes(kw));
      else if (searchTarget === '아이디') result = result.filter(a => a.email.toLowerCase().includes(kw));
      else if (searchTarget === '사업자번호') result = result.filter(a => a.bizNo.includes(kw));
      else result = result.filter(a => a.companyName.toLowerCase().includes(kw));
    }

    setFiltered(result);
  }

  function handleReset() {
    setDateType('등록일자'); setFromDate(''); setToDate('');
    setStatus('전체'); setSearchTarget('이름'); setSearchKw('');
    setFiltered(MOCK_BIZ_ACCOUNTS);
  }

  return (
    <div>
      <div className="page-title">사업장 관리자 계정</div>

      {/* KPI 카드 */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="label">전체</div>
          <div className="value">3,241</div>
        </div>
        <div className="kpi-card">
          <div className="label">정상</div>
          <div className="value" style={{ color: 'var(--green-600)' }}>3,101</div>
        </div>
        <div className="kpi-card">
          <div className="label">해지</div>
          <div className="value" style={{ color: 'var(--gray-500)' }}>122</div>
        </div>
        <div className="kpi-card">
          <div className="label">삭제</div>
          <div className="value" style={{ color: 'var(--red-600)' }}>18</div>
        </div>
      </div>

      {/* 검색 패널 */}
      <SearchPanel>
        {/* 1행: 조회기간 / 상태 */}
        <div className="search-row">
          <span className="search-label">조회기간</span>
          <select value={dateType} onChange={e => setDateType(e.target.value)}>
            {DATE_TYPES.map(o => <option key={o}>{o}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <span style={{ fontSize: 12 }}>~</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          <span className="search-label" style={{ marginLeft: 16 }}>상태</span>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* 2행: 검색 + 버튼 */}
        <div className="search-row">
          <span className="search-label">검색</span>
          <select value={searchTarget} onChange={e => setSearchTarget(e.target.value)}>
            {SEARCH_TARGETS.map(o => <option key={o}>{o}</option>)}
          </select>
          <input
            type="text"
            value={searchKw}
            onChange={e => setSearchKw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="검색어 입력"
            style={{ width: 200 }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>조회</button>
          <button className="btn btn-sm" onClick={handleReset}>초기화</button>
        </div>
      </SearchPanel>

      {/* 테이블 */}
      <div className="table-wrap">
        <ResizableTable columns={BIZ_ADMIN_COLUMNS} data={filtered} />
      </div>
    </div>
  );
}
