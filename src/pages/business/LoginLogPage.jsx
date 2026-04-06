import { useState } from 'react';
import { MOCK_LOGIN_LOGS } from '../../data/mockLoginLogs';
import Badge from '../../components/common/Badge';
import SearchPanel from '../../components/common/SearchPanel';
import ResizableTable from '../../components/common/ResizableTable';

const LOGIN_LOG_COLUMNS = [
  { key: 'joinDate',    label: '가입일자',       width: 100, sortable: true },
  { key: 'bizNo',       label: '사업자번호',     width: 120, sortable: true },
  { key: 'companyName', label: '회사명',         width: 160, sortable: true,
    render: l => <span style={{ fontWeight: 600 }}>{l.companyName}</span> },
  { key: 'productName', label: '상품명',         width: 150, sortable: true },
  { key: 'status',      label: '상태',           width: 80,  sortable: true, render: l => <Badge value={l.status} /> },
  { key: 'loginCount',  label: '로그인 횟수',    width: 100, sortable: true, align: 'right',
    render: l => <span style={{ fontWeight: 700 }}>{l.loginCount.toLocaleString()}</span> },
  { key: 'lastLogin',   label: '최종 로그인일시', width: 160, sortable: true },
];

const PERIOD_TYPES   = ['일별', '기간별', '월별'];
const SEARCH_TARGETS = ['사업자번호', '사업장명', 'IP주소', '아이디', '사용자명'];
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const YEARS  = ['2023', '2024', '2025'];

export default function LoginLogPage() {
  const [periodType,   setPeriodType]   = useState('기간별');
  const [singleDate,   setSingleDate]   = useState('');
  const [fromDate,     setFromDate]     = useState('');
  const [toDate,       setToDate]       = useState('');
  const [year,         setYear]         = useState('2025');
  const [month,        setMonth]        = useState('03');
  const [searchTarget, setSearchTarget] = useState('사업장명');
  const [searchKw,     setSearchKw]     = useState('');
  const [filtered,     setFiltered]     = useState(MOCK_LOGIN_LOGS);

  function handleSearch() {
    let result = [...MOCK_LOGIN_LOGS];
    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase();
      if (searchTarget === '사업자번호') result = result.filter(l => l.bizNo.includes(kw));
      else if (searchTarget === '사업장명') result = result.filter(l => l.companyName.toLowerCase().includes(kw));
      // IP주소 / 아이디 / 사용자명은 mock 데이터에 필드 없음 — 전체 결과 반환
    }
    setFiltered(result);
  }

  function handleReset() {
    setPeriodType('기간별'); setSingleDate('');
    setFromDate(''); setToDate('');
    setYear('2025'); setMonth('03');
    setSearchTarget('사업장명'); setSearchKw('');
    setFiltered(MOCK_LOGIN_LOGS);
  }

  const totalLogin = filtered.reduce((s, l) => s + l.loginCount, 0);
  const failCount  = 14; // mock 고정값

  return (
    <div>
      <div className="page-title">로그인 이력</div>

      {/* KPI 카드 */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="label">조회기간 총 로그인</div>
          <div className="value">8,742</div>
        </div>
        <div className="kpi-card">
          <div className="label">사업장 수</div>
          <div className="value">438</div>
        </div>
        <div className="kpi-card">
          <div className="label">로그인 실패</div>
          <div className="value" style={{ color: 'var(--amber-600)' }}>14</div>
        </div>
        <div className="kpi-card">
          <div className="label">이상 탐지</div>
          <div className="value" style={{ color: 'var(--red-600)' }}>2</div>
        </div>
      </div>

      {/* 검색 패널 */}
      <SearchPanel>
        {/* 1행: 기간구분 — 선택에 따라 동적 UI */}
        <div className="search-row">
          <span className="search-label">기간구분</span>
          <select value={periodType} onChange={e => setPeriodType(e.target.value)}>
            {PERIOD_TYPES.map(o => <option key={o}>{o}</option>)}
          </select>

          {/* 일별: 날짜 1개 */}
          {periodType === '일별' && (
            <input
              type="date"
              value={singleDate}
              onChange={e => setSingleDate(e.target.value)}
            />
          )}

          {/* 기간별: from ~ to */}
          {periodType === '기간별' && (
            <>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              <span style={{ fontSize: 12 }}>~</span>
              <input type="date" value={toDate}   onChange={e => setToDate(e.target.value)} />
            </>
          )}

          {/* 월별: 년 + 월 드롭다운 */}
          {periodType === '월별' && (
            <>
              <select value={year} onChange={e => setYear(e.target.value)}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
              <span style={{ fontSize: 12 }}>년</span>
              <select value={month} onChange={e => setMonth(e.target.value)}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <span style={{ fontSize: 12 }}>월</span>
            </>
          )}
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
          <button className="btn btn-sm" style={{ marginLeft: 4 }}>엑셀 다운로드</button>
        </div>
      </SearchPanel>

      {/* 집계 바 */}
      <div className="summary-bar">
        <div className="item">
          <span>조회결과</span>
          <span className="val">{filtered.length}건</span>
          <span style={{ color: 'var(--gray-400)', fontSize: 11 }}>(사업장 기준)</span>
        </div>
        <span className="sep">|</span>
        <div className="item">
          <span>총 로그인 횟수</span>
          <span className="val">{totalLogin.toLocaleString()}회</span>
        </div>
        <span className="sep">|</span>
        <div className="item">
          <span>실패</span>
          <span className="val" style={{ color: 'var(--red-600)' }}>{failCount}회</span>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-wrap">
        <ResizableTable columns={LOGIN_LOG_COLUMNS} data={filtered} />
      </div>
    </div>
  );
}
