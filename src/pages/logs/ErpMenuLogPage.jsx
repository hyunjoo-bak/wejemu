import { useState } from 'react';
import { MOCK_MENU_LOGS, TASK_STATS, BIZ_ACTIVITY } from '../../data/mockMenuLogs';
import Badge from '../../components/common/Badge';
import SearchPanel from '../../components/common/SearchPanel';

const TASK_OPTIONS = ['전체', '영업', '자금', '회계', '인사급여', '예산', '공통'];
const MENU_OPTIONS = ['전체', '전표 입력', '급여 관리', '세금계산서', '자금 현황', '장부 조회', '결산 보고', '예산 편성'];
const SEARCH_TARGETS = ['사업자번호', '사업장명'];

const ACTIVITY_VARIANT = {
  '매우활발': 'success',
  '활발': 'blue',
  '보통': 'warning',
  '저조': 'gray',
};

export default function ErpMenuLogPage() {
  const [task, setTask] = useState('전체');
  const [menu, setMenu] = useState('전체');
  const [searchTarget, setSearchTarget] = useState('사업장명');
  const [searchKw, setSearchKw] = useState('');
  const [filtered, setFiltered] = useState(MOCK_MENU_LOGS);

  function handleSearch() {
    let result = [...MOCK_MENU_LOGS];
    if (task !== '전체') result = result.filter(l => l.task === task);
    if (menu !== '전체') result = result.filter(l => l.menu === menu);
    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase();
      if (searchTarget === '사업자번호') result = result.filter(l => l.bizNo.includes(kw));
      else result = result.filter(l => l.companyName.toLowerCase().includes(kw));
    }
    setFiltered(result);
  }

  function handleReset() {
    setTask('전체'); setMenu('전체'); setSearchTarget('사업장명'); setSearchKw('');
    setFiltered(MOCK_MENU_LOGS);
  }

  const maxCount = Math.max(...TASK_STATS.map(s => s.count));

  return (
    <div>
      <div className="page-title">ERP 메뉴 사용 로그</div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="label">오늘 총 클릭</div><div className="value">12,841</div></div>
        <div className="kpi-card"><div className="label">활성 사업장(오늘)</div><div className="value">438</div></div>
        <div className="kpi-card"><div className="label">최다 사용 메뉴</div><div className="value" style={{ fontSize: 16 }}>전표 입력</div></div>
        <div className="kpi-card"><div className="label">미사용(30일)</div><div className="value" style={{ color: 'var(--amber-600)' }}>87</div></div>
      </div>

      <SearchPanel>
        <div className="search-row">
          <span className="search-label">업무명</span>
          <select value={task} onChange={e => setTask(e.target.value)}>
            {TASK_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="search-label">메뉴명</span>
          <select value={menu} onChange={e => setMenu(e.target.value)}>
            {MENU_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="search-label" style={{ marginLeft: 8 }}>검색</span>
          <select value={searchTarget} onChange={e => setSearchTarget(e.target.value)}>
            {SEARCH_TARGETS.map(o => <option key={o}>{o}</option>)}
          </select>
          <input type="text" value={searchKw} onChange={e => setSearchKw(e.target.value)} placeholder="검색어 입력" style={{ width: 200 }} />
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>조회</button>
          <button className="btn btn-sm" onClick={handleReset}>초기화</button>
          <button className="btn btn-sm" style={{ marginLeft: 4 }}>엑셀 다운로드</button>
        </div>
      </SearchPanel>

      {/* 2열 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* 업무별 사용 현황 */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>업무별 사용 현황 (이번 달)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TASK_STATS.map(s => (
              <div key={s.task} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 60, fontSize: 12, color: 'var(--gray-500)', textAlign: 'right', flexShrink: 0 }}>{s.task}</div>
                <div style={{ flex: 1, height: 18, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(s.count / maxCount) * 100}%`,
                    height: '100%',
                    background: 'var(--purple-600)',
                    borderRadius: 4,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <div style={{ width: 60, fontSize: 12, color: 'var(--color-text)', fontWeight: 600, flexShrink: 0 }}>
                  {s.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사업장별 활동도 */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>사업장별 활동도</div>
          <table>
            <thead>
              <tr>
                <th>사업장명</th>
                <th style={{ textAlign: 'right' }}>이번 달</th>
                <th>마지막 사용</th>
                <th>활동도</th>
              </tr>
            </thead>
            <tbody>
              {BIZ_ACTIVITY.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{b.companyName}</td>
                  <td style={{ textAlign: 'right' }}>{b.monthCount.toLocaleString()}</td>
                  <td>{b.lastUse}</td>
                  <td><Badge value={b.activity} variant={ACTIVITY_VARIANT[b.activity]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 원시 로그 테이블 */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: 14, borderBottom: '0.5px solid var(--color-border)' }}>
          원시 로그
        </div>
        <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>시간</th>
                <th>사업자번호</th>
                <th>사업장명</th>
                <th>업무</th>
                <th>메뉴</th>
                <th>사용자</th>
                <th>액션</th>
                <th>소요시간</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'monospace' }}>{l.time}</td>
                  <td>{l.bizNo}</td>
                  <td style={{ fontWeight: 600 }}>{l.companyName}</td>
                  <td><Badge value={l.task} /></td>
                  <td>{l.menu}</td>
                  <td>{l.user}</td>
                  <td>{l.action}</td>
                  <td style={{ fontFamily: 'monospace' }}>{l.duration}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 24 }}>검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
