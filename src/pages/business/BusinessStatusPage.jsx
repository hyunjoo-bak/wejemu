import { useState } from 'react';
import { MOCK_BUSINESSES } from '../../data/mockBusinesses';
import Badge from '../../components/common/Badge';
import SearchPanel from '../../components/common/SearchPanel';
import Pagination from '../../components/common/Pagination';

const DATE_OPTIONS = ['가입일자', '설치일자', '해지일자', '정지일자', '최종사용일자'];
const STATUS_OPTIONS = ['정상', '해지', '정지'];
const STATUS_SUB = ['일반', '연체', '활성화', '휴폐업'];
const CHANNEL_OPTIONS = ['전체', '홈페이지', '파트너', '영업팀', '이벤트'];
const BANK_OPTIONS = ['전체', '국민은행', '신한은행', '우리은행', '하나은행'];
const PRODUCT_OPTIONS = ['전체', '경리나라 Basic', '경리나라 Pro', '경리나라 Enterprise'];
const SERVICE_OPTIONS1 = ['전체', '클라우드', '설치형', '하이브리드'];
const SERVICE_OPTIONS2 = ['전체', 'ERP', '회계', '인사급여'];
const SEARCH_TARGET = ['전체', '사업자번호', '사업장명'];

const PAGE_SIZE = 10;

export default function BusinessStatusPage() {
  const [channel, setChannel] = useState('전체');
  const [bank, setBank] = useState('전체');
  const [product, setProduct] = useState('전체');
  const [svcType1, setSvcType1] = useState('전체');
  const [svcType2, setSvcType2] = useState('전체');
  const [custTypes, setCustTypes] = useState({ 일반: false, 무료: false });
  const [searchTarget, setSearchTarget] = useState('전체');
  const [searchKw, setSearchKw] = useState('');
  const [installs, setInstalls] = useState({ 설치: false, 미설치: false });
  const [dateType, setDateType] = useState('가입일자');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statuses, setStatuses] = useState({});
  const [subStatuses, setSubStatuses] = useState({});
  const [filtered, setFiltered] = useState(MOCK_BUSINESSES);
  const [page, setPage] = useState(1);

  function handleSearch() {
    let result = [...MOCK_BUSINESSES];
    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase();
      if (searchTarget === '사업자번호') result = result.filter(b => b.bizNo.includes(kw));
      else if (searchTarget === '사업장명') result = result.filter(b => b.companyName.toLowerCase().includes(kw));
      else result = result.filter(b => b.bizNo.includes(kw) || b.companyName.toLowerCase().includes(kw));
    }
    if (channel !== '전체') result = result.filter(b => b.channel === channel);
    if (product !== '전체') result = result.filter(b => b.productName === product);
    if (svcType1 !== '전체') result = result.filter(b => b.serviceType === svcType1);
    const selCust = Object.entries(custTypes).filter(([, v]) => v).map(([k]) => k);
    if (selCust.length > 0) result = result.filter(b => selCust.includes(b.customerType));
    const selStatus = Object.entries(statuses).filter(([, v]) => v).map(([k]) => k);
    if (selStatus.length > 0) result = result.filter(b => selStatus.includes(b.status));
    setFiltered(result);
    setPage(1);
  }

  function handleReset() {
    setChannel('전체'); setBank('전체'); setProduct('전체');
    setSvcType1('전체'); setSvcType2('전체');
    setCustTypes({ 일반: false, 무료: false });
    setSearchTarget('전체'); setSearchKw('');
    setInstalls({ 설치: false, 미설치: false });
    setDateType('가입일자'); setFromDate(''); setToDate('');
    setStatuses({}); setSubStatuses({});
    setFiltered(MOCK_BUSINESSES);
    setPage(1);
  }

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="page-title">사업장 현황</div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">전체</div><div className="value">1,284</div></div>
        <div className="kpi-card"><div className="label">정상</div><div className="value" style={{ color: 'var(--green-600)' }}>1,156</div></div>
        <div className="kpi-card"><div className="label">해지</div><div className="value" style={{ color: 'var(--gray-500)' }}>125</div></div>
        <div className="kpi-card"><div className="label">미결제</div><div className="value" style={{ color: 'var(--amber-600)' }}>3</div></div>
      </div>

      {/* 검색 패널 */}
      <SearchPanel>
        {/* 1행 */}
        <div className="search-row">
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
          <span className="search-label" style={{ marginLeft: 8 }}>서비스유형</span>
          <select value={svcType1} onChange={e => setSvcType1(e.target.value)}>
            {SERVICE_OPTIONS1.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={svcType2} onChange={e => setSvcType2(e.target.value)}>
            {SERVICE_OPTIONS2.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="search-label" style={{ marginLeft: 8 }}>고객구분</span>
          <div className="checkbox-group">
            {['일반', '무료'].map(k => (
              <label key={k} className="checkbox-item">
                <input type="checkbox" checked={!!custTypes[k]} onChange={e => setCustTypes(p => ({ ...p, [k]: e.target.checked }))} />
                {k}
              </label>
            ))}
          </div>
        </div>

        {/* 2행 */}
        <div className="search-row">
          <span className="search-label">검색대상</span>
          <select value={searchTarget} onChange={e => setSearchTarget(e.target.value)}>
            {SEARCH_TARGET.map(o => <option key={o}>{o}</option>)}
          </select>
          <input type="text" value={searchKw} onChange={e => setSearchKw(e.target.value)} placeholder="검색어 입력" style={{ width: 200 }} />
          <span className="search-label" style={{ marginLeft: 8 }}>설치여부</span>
          <div className="checkbox-group">
            {['설치', '미설치'].map(k => (
              <label key={k} className="checkbox-item">
                <input type="checkbox" checked={!!installs[k]} onChange={e => setInstalls(p => ({ ...p, [k]: e.target.checked }))} />
                {k}
              </label>
            ))}
          </div>
        </div>

        {/* 3행 */}
        <div className="search-row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <span className="search-label">조회기간</span>
          <select value={dateType} onChange={e => setDateType(e.target.value)}>
            {DATE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <span style={{ fontSize: 12 }}>~</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          <button className="btn btn-sm" onClick={() => { setFromDate(''); setToDate(''); }}>전체</button>
          <button className="btn btn-sm" onClick={() => { const t = new Date().toISOString().slice(0,10); setFromDate(t); setToDate(t); }}>당일</button>
          <span className="search-label" style={{ marginLeft: 16 }}>상태</span>
          <div className="checkbox-group">
            {STATUS_OPTIONS.map(k => (
              <label key={k} className="checkbox-item">
                <input type="checkbox" checked={!!statuses[k]} onChange={e => setStatuses(p => ({ ...p, [k]: e.target.checked }))} />
                {k}
              </label>
            ))}
          </div>
          <div className="checkbox-group" style={{ marginLeft: 8 }}>
            {STATUS_SUB.map(k => (
              <label key={k} className="checkbox-item">
                <input type="checkbox" checked={!!subStatuses[k]} onChange={e => setSubStatuses(p => ({ ...p, [k]: e.target.checked }))} />
                {k}
              </label>
            ))}
          </div>
        </div>

        {/* 버튼행 */}
        <div className="search-row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>조회</button>
            <button className="btn btn-sm" onClick={handleReset}>초기화</button>
          </div>
          <button className="btn btn-blue btn-sm">파일저장</button>
        </div>
      </SearchPanel>

      {/* 집계 요약 바 */}
      <div className="summary-bar">
        <div className="item"><span>전체</span><span className="val">101,279개</span></div>
        <div style={{ color: 'var(--purple-200)' }}>|</div>
        <div className="item"><span>정상기관(설치/미설치)</span><span className="val">24,038(14,847/9,191)개</span></div>
        <div style={{ color: 'var(--purple-200)' }}>|</div>
        <div className="item"><span>해지기관(중지/해지)</span><span className="val">6,931/70,310개</span></div>
        <span style={{ marginLeft: 'auto', color: 'var(--gray-500)', fontSize: 11 }}>조회결과 {filtered.length}건</span>
      </div>

      {/* 테이블 */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>가입일자</th>
              <th>설치일자</th>
              <th>사업자번호</th>
              <th>회사명</th>
              <th>대표자</th>
              <th>가입채널</th>
              <th>상품명</th>
              <th>서비스유형</th>
              <th>상태</th>
              <th>최종사용일자</th>
              <th>고객구분</th>
              <th>출금계좌등록여부</th>
              <th>업태</th>
              <th>종목</th>
              <th>최초관리자</th>
              <th>등록일시</th>
              <th>수정일시</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(b => (
              <tr key={b.id}>
                <td><input type="checkbox" /></td>
                <td>{b.joinDate}</td>
                <td>{b.installDate}</td>
                <td style={{ cursor: 'pointer', color: 'var(--blue-600)' }} onClick={() => {}}>{b.bizNo}</td>
                <td style={{ cursor: 'pointer', color: 'var(--blue-600)', fontWeight: 600 }} onClick={() => {}}>{b.companyName}</td>
                <td>{b.ceo}</td>
                <td>{b.channel}</td>
                <td>{b.productName}</td>
                <td><Badge value={b.serviceType} /></td>
                <td><Badge value={b.status} /></td>
                <td>{b.lastUseDate}</td>
                <td><Badge value={b.customerType} /></td>
                <td style={{ textAlign: 'center' }}>{b.hasWithdrawal ? '등록' : '미등록'}</td>
                <td>{b.bizType}</td>
                <td>{b.bizItem}</td>
                <td>{b.firstAdmin}</td>
                <td>{b.createdAt}</td>
                <td>{b.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalCount={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
