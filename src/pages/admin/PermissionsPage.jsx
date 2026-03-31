import { useState } from 'react';

const ROLES = ['마스터', '관리자', 'CS(관리자)', 'CS(사용자)', '상품/마케팅', '개발'];
const MENUS = [
  '대시보드', '사업장 목록', '가입/계약 관리', '요금/결제',
  '사업장 관리자 계정', '어드민 계정 관리', '로그인 이력',
  'ERP 메뉴 로그', '상품 관리', '시스템 설정',
];

// ON=2, HALF=1, OFF=0
const INITIAL = [
  [2,2,1,1,1,1],  // 대시보드
  [2,2,1,1,1,1],  // 사업장 목록
  [2,2,0,0,0,1],  // 가입/계약 관리
  [2,2,0,0,0,0],  // 요금/결제
  [2,2,1,1,0,1],  // 사업장 관리자 계정
  [2,1,0,0,0,0],  // 어드민 계정 관리
  [2,2,2,1,0,2],  // 로그인 이력
  [2,2,2,1,1,2],  // ERP 메뉴 로그
  [2,2,0,0,2,1],  // 상품 관리
  [2,0,0,0,0,2],  // 시스템 설정
];

function TriCheckbox({ value, onChange }) {
  const style = {
    0: { bg: 'white', border: 'var(--color-border)', content: '' },
    1: { bg: 'var(--purple-50)', border: 'var(--purple-400)', content: '—' },
    2: { bg: 'var(--purple-800)', border: 'var(--purple-800)', content: '✓' },
  }[value];

  return (
    <div
      onClick={() => onChange((value + 1) % 3)}
      style={{
        width: 22, height: 22, borderRadius: 5,
        border: `1.5px solid ${style.border}`,
        background: style.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: value === 2 ? 'white' : 'var(--purple-800)',
        fontSize: value === 1 ? 14 : 12,
        fontWeight: 700,
        userSelect: 'none',
      }}
    >
      {style.content}
    </div>
  );
}

export default function PermissionsPage() {
  const [matrix, setMatrix] = useState(INITIAL.map(row => [...row]));
  const [toast, setToast] = useState(false);

  function handleChange(menuIdx, roleIdx, val) {
    setMatrix(m => m.map((row, i) => i === menuIdx ? row.map((v, j) => j === roleIdx ? val : v) : row));
  }

  function handleSave() {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <div>
      <div className="page-title">권한 설정</div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, fontSize: 12, alignItems: 'center' }}>
        <span style={{ color: 'var(--gray-500)' }}>범례:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TriCheckbox value={2} onChange={() => {}} /> 허용(ON)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TriCheckbox value={1} onChange={() => {}} /> 읽기전용(HALF)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TriCheckbox value={0} onChange={() => {}} /> 차단(OFF)
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 160 }}>메뉴</th>
                {ROLES.map(r => <th key={r} style={{ textAlign: 'center' }}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {MENUS.map((menu, mi) => (
                <tr key={menu}>
                  <td style={{ fontWeight: 600 }}>{menu}</td>
                  {ROLES.map((_, ri) => (
                    <td key={ri} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TriCheckbox value={matrix[mi][ri]} onChange={val => handleChange(mi, ri, val)} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button className="btn btn-primary" onClick={handleSave}>저장</button>
      </div>

      {toast && <div className="toast">저장되었습니다.</div>}
    </div>
  );
}
