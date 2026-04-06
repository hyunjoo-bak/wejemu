import { useState } from 'react';
import { MOCK_BUSINESSES } from '../../data/mockBusinesses';
import Badge from '../../components/common/Badge';
import SearchPanel from '../../components/common/SearchPanel';
import Pagination from '../../components/common/Pagination';
import ResizableTable from '../../components/common/ResizableTable';

const BIZ_COLUMNS = [
  { key: '_check',       label: '',              width: 36,  sortable: false, render: () => <input type="checkbox" /> },
  { key: 'joinDate',     label: '가입일자',      width: 100, sortable: true },
  { key: 'installDate',  label: '설치일자',      width: 100, sortable: true },
  { key: 'bizNo',        label: '사업자번호',    width: 110, sortable: true,
    render: b => <span style={{ cursor: 'pointer', color: 'var(--blue-600)' }} onClick={() => { /* TODO: 상세 모달 */ }}>{b.bizNo}</span> },
  { key: 'companyName',  label: '회사명',        width: 140, sortable: true,
    render: b => <span style={{ cursor: 'pointer', color: 'var(--blue-600)', fontWeight: 600 }} onClick={() => { /* TODO: 상세 모달 */ }}>{b.companyName}</span> },
  { key: 'ceo',          label: '대표자',        width: 80,  sortable: true },
  { key: 'channel',      label: '가입채널',      width: 90,  sortable: true },
  { key: 'productName',  label: '상품명',        width: 150, sortable: true },
  { key: 'serviceType',  label: '서비스유형',    width: 90,  sortable: true, render: b => <Badge value={b.serviceType} /> },
  { key: 'status',       label: '상태',          width: 70,  sortable: true, render: b => <Badge value={b.status} /> },
  { key: 'lastUseDate',  label: '최종사용일자',  width: 110, sortable: true },
  { key: 'customerType', label: '고객구분',      width: 80,  sortable: true, render: b => <Badge value={b.customerType} /> },
  { key: 'hasWithdrawal',label: '출금계좌등록여부', width: 120, sortable: false, align: 'center',
    render: b => b.hasWithdrawal ? '등록' : '미등록' },
  { key: 'bizType',      label: '업태',          width: 90,  sortable: true },
  { key: 'bizItem',      label: '종목',          width: 90,  sortable: true },
  { key: 'firstAdmin',   label: '최초관리자',    width: 100, sortable: true },
  { key: 'createdAt',    label: '등록일시',      width: 120, sortable: true },
  { key: 'updatedAt',    label: '수정일시',      width: 120, sortable: true },
];

const DATE_OPTIONS    = ['가입일자', '설치일자', '해지일자', '정지일자', '최종사용일자'];
const CHANNEL_OPTIONS = ['전체', '홈페이지', '파트너', '영업팀', '이벤트'];
const BANK_OPTIONS    = ['전체', '국민은행', '신한은행', '우리은행', '하나은행'];
const PRODUCT_OPTIONS = ['전체', 'WEJEMU Basic', 'WEJEMU Pro', 'WEJEMU Enterprise'];
const SVC_TYPE1       = ['전체', '클라우드', '설치형', '하이브리드'];
const SVC_TYPE2       = ['전체', 'ERP', '회계', '인사급여'];
const SEARCH_TARGETS  = ['전체', '사업자번호', '사업장명'];
const STATUS_MAIN     = ['정상', '해지', '정지'];
const STATUS_SUB      = ['일반', '연체', '활성화', '휴폐업'];

function initCheck(keys) {
  return Object.fromEntries(keys.map(k => [k, false]));
}

/* 검색행 내부를 좌/우 절반으로 나누는 래퍼 */
function HalfRow({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
      {children}
    </div>
  );
}

export default function BusinessStatusPage() {
  // 검색 조건
  const [channel,      setChannel]      = useState('전체');
  const [bank,         setBank]         = useState('전체');
  const [product,      setProduct]      = useState('전체');
  const [svcType1,     setSvcType1]     = useState('전체');
  const [svcType2,     setSvcType2]     = useState('전체');
  const [custTypes,    setCustTypes]    = useState(initCheck(['일반', '무료']));
  const [searchTarget, setSearchTarget] = useState('전체');
  const [searchKw,     setSearchKw]     = useState('');
  const [installs,     setInstalls]     = useState(initCheck(['설치', '미설치']));
  const [dateType,     setDateType]     = useState('가입일자');
  const [fromDate,     setFromDate]     = useState('');
  const [toDate,       setToDate]       = useState('');
  const [statuses,     setStatuses]     = useState(initCheck(STATUS_MAIN));
  const [subStatuses,  setSubStatuses]  = useState(initCheck(STATUS_SUB));
  // 결과
  const [filtered,  setFiltered]  = useState(MOCK_BUSINESSES);
  const [page,      setPage]      = useState(1);
  const [pageSize,  setPageSize]  = useState(10);

  function handleSearch() {
    let result = [...MOCK_BUSINESSES];

    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase();
      if (searchTarget === '사업자번호')    result = result.filter(b => b.bizNo.includes(kw));
      else if (searchTarget === '사업장명') result = result.filter(b => b.companyName.toLowerCase().includes(kw));
      else result = result.filter(b => b.bizNo.includes(kw) || b.companyName.toLowerCase().includes(kw));
    }

    if (channel !== '전체') result = result.filter(b => b.channel === channel);
    if (product !== '전체') result = result.filter(b => b.productName === product);
    if (svcType1 !== '전체') result = result.filter(b => b.serviceType === svcType1);

    const selCust = Object.entries(custTypes).filter(([, v]) => v).map(([k]) => k);
    if (selCust.length > 0) result = result.filter(b => selCust.includes(b.customerType));

    const selInstall = Object.entries(installs).filter(([, v]) => v).map(([k]) => k);
    if (selInstall.length > 0) {
      result = result.filter(b => {
        const installed = b.installDate && b.installDate !== '—';
        if (selInstall.includes('설치')   && installed)  return true;
        if (selInstall.includes('미설치') && !installed) return true;
        return false;
      });
    }

    const selStatus = Object.entries(statuses).filter(([, v]) => v).map(([k]) => k);
    if (selStatus.length > 0) result = result.filter(b => selStatus.includes(b.status));

    setFiltered(result);
    setPage(1);
  }

  function handleReset() {
    setChannel('전체'); setBank('전체'); setProduct('전체');
    setSvcType1('전체'); setSvcType2('전체');
    setCustTypes(initCheck(['일반', '무료']));
    setSearchTarget('전체'); setSearchKw('');
    setInstalls(initCheck(['설치', '미설치']));
    setDateType('가입일자'); setFromDate(''); setToDate('');
    setStatuses(initCheck(STATUS_MAIN));
    setSubStatuses(initCheck(STATUS_SUB));
    setFiltered(MOCK_BUSINESSES);
    setPage(1);
  }

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="page-title">사업장 현황</div>

      {/* KPI 카드 */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="label">전체</div>
          <div className="value">1,284</div>
        </div>
        <div className="kpi-card">
          <div className="label">정상</div>
          <div className="value" style={{ color: 'var(--green-600)' }}>1,156</div>
        </div>
        <div className="kpi-card">
          <div className="label">해지</div>
          <div className="value" style={{ color: 'var(--gray-500)' }}>125</div>
        </div>
        <div className="kpi-card">
          <div className="label">미결제</div>
          <div className="value" style={{ color: 'var(--amber-600)' }}>3</div>
        </div>
      </div>

      {/* 검색 패널 */}
      <SearchPanel>
        {/* 1행: [제품구분 ▾▾▾] | [서비스유형 ▾▾  고객구분 □□] */}
        <div className="search-row" style={{ gap: 0 }}>
          <HalfRow>
            <span className="search-label">제품구분</span>
            <select value={channel} onChange={e => setChannel(e.target.value)}>
              {CHANNEL_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={bank} onChange={e => setBank(e.target.value)}>
              {BANK_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={product} onChange={e => setProduct(e.target.value)}>
              {PRODUCT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </HalfRow>
          <HalfRow>
            <span className="search-label">서비스유형</span>
            <select value={svcType1} onChange={e => setSvcType1(e.target.value)}>
              {SVC_TYPE1.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={svcType2} onChange={e => setSvcType2(e.target.value)}>
              {SVC_TYPE2.map(o => <option key={o}>{o}</option>)}
            </select>
            <span className="search-label" style={{ marginLeft: 8 }}>고객구분</span>
            <div className="checkbox-group">
              {['일반', '무료'].map(k => (
                <label key={k} className="checkbox-item">
                  <input type="checkbox" checked={!!custTypes[k]}
                    onChange={e => setCustTypes(p => ({ ...p, [k]: e.target.checked }))} />
                  {k}
                </label>
              ))}
            </div>
          </HalfRow>
        </div>

        {/* 2행: [검색대상 ▾ 입력] | [설치여부 □□] */}
        <div className="search-row" style={{ gap: 0 }}>
          <HalfRow>
            <span className="search-label">검색대상</span>
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
          </HalfRow>
          <HalfRow>
            <span className="search-label">설치여부</span>
            <div className="checkbox-group">
              {['설치', '미설치'].map(k => (
                <label key={k} className="checkbox-item">
                  <input type="checkbox" checked={!!installs[k]}
                    onChange={e => setInstalls(p => ({ ...p, [k]: e.target.checked }))} />
                  {k}
                </label>
              ))}
            </div>
          </HalfRow>
        </div>

        {/* 3행: [조회기간 ▾ 날짜~날짜 전체 당일] | [상태 □□□ □□□□] */}
        <div className="search-row" style={{ gap: 0 }}>
          <HalfRow>
            <span className="search-label">조회기간</span>
            <select value={dateType} onChange={e => setDateType(e.target.value)}>
              {DATE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span style={{ fontSize: 12 }}>~</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            <button className="btn btn-sm" onClick={() => { setFromDate(''); setToDate(''); }}>전체</button>
            <button className="btn btn-sm" onClick={() => {
              const t = new Date().toISOString().slice(0, 10);
              setFromDate(t); setToDate(t);
            }}>당일</button>
          </HalfRow>
          <HalfRow>
            <span className="search-label">상태</span>
            <div className="checkbox-group">
              {STATUS_MAIN.map(k => (
                <label key={k} className="checkbox-item">
                  <input type="checkbox" checked={!!statuses[k]}
                    onChange={e => setStatuses(p => ({ ...p, [k]: e.target.checked }))} />
                  {k}
                </label>
              ))}
            </div>
            <div className="checkbox-group" style={{ marginLeft: 8 }}>
              {STATUS_SUB.map(k => (
                <label key={k} className="checkbox-item">
                  <input type="checkbox" checked={!!subStatuses[k]}
                    onChange={e => setSubStatuses(p => ({ ...p, [k]: e.target.checked }))} />
                  {k}
                </label>
              ))}
            </div>
          </HalfRow>
        </div>

        {/* 버튼행: 조회/초기화 우측 정렬 */}
        <div className="search-row" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>조회</button>
          <button className="btn btn-sm" onClick={handleReset}>초기화</button>
        </div>
      </SearchPanel>

      {/* 파일저장: 검색박스 바깥, 목록 우측 상단 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn btn-blue btn-sm">파일저장</button>
      </div>

      {/* 집계 요약 바 */}
      <div className="summary-bar">
        <div className="item"><span>전체</span><span className="val">101,279개</span></div>
        <span className="sep">|</span>
        <div className="item">
          <span>정상기관(설치/미설치)</span>
          <span className="val">24,038(14,847/9,191)개</span>
        </div>
        <span className="sep">|</span>
        <div className="item">
          <span>해지기관(중지/해지)</span>
          <span className="val">6,931/70,310개</span>
        </div>
      </div>

      {/* 테이블 — 18컬럼 가로 스크롤 */}
      <div className="table-wrap">
        <ResizableTable columns={BIZ_COLUMNS} data={paged} />
      </div>

      {/* 페이지네이션: [페이지당 건수] [페이지번호] [조회결과 N건] */}
      <Pagination
        page={page}
        totalCount={filtered.length}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={size => { setPageSize(size); setPage(1); }}
      />
    </div>
  );
}
