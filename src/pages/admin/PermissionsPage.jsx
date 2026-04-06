import { useState } from 'react';

const ROLES = ['마스터', '관리자', 'CS(관리자)', 'CS(사용자)', '상품/마케팅', '개발'];

const MENUS = [
  '대시보드',
  '사업장 목록',
  '가입/계약 관리',
  '요금/결제',
  '사업장 관리자 계정',
  '어드민 계정 관리',
  '로그인 이력',
  'ERP 메뉴 로그',
  '상품 관리',
  '시스템 설정',
];

// 2=ON(허용), 1=HALF(읽기전용), 0=OFF(차단)
// 행: 메뉴, 열: 역할 순서 (마스터/관리자/CS관리자/CS사용자/상품마케팅/개발)
const INITIAL_MATRIX = [
  [2, 2, 1, 1, 1, 1], // 대시보드
  [2, 2, 1, 1, 1, 1], // 사업장 목록
  [2, 2, 0, 0, 0, 1], // 가입/계약 관리
  [2, 2, 0, 0, 0, 0], // 요금/결제
  [2, 2, 1, 1, 0, 1], // 사업장 관리자 계정
  [2, 1, 0, 0, 0, 0], // 어드민 계정 관리
  [2, 2, 2, 1, 0, 2], // 로그인 이력
  [2, 2, 2, 1, 1, 2], // ERP 메뉴 로그
  [2, 2, 0, 0, 2, 1], // 상품 관리
  [2, 0, 0, 0, 0, 2], // 시스템 설정
];

// 3상태 체크박스: 0=OFF, 1=HALF(읽기전용), 2=ON(허용)
function TriCheckbox({ value, onChange }) {
  const STYLE = {
    0: { bg: 'white',              border: 'var(--color-border)', label: '' },
    1: { bg: 'var(--purple-50)',   border: 'var(--purple-400)',   label: '—' },
    2: { bg: 'var(--purple-800)',  border: 'var(--purple-800)',   label: '✓' },
  };
  const s = STYLE[value];
  return (
    <div
      onClick={() => onChange((value + 1) % 3)}
      title={['차단(OFF)', '읽기전용(HALF)', '허용(ON)'][value]}
      style={{
        width: 22, height: 22,
        borderRadius: 5,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: value === 2 ? 'white' : 'var(--purple-800)',
        fontSize: value === 1 ? 14 : 12,
        fontWeight: 700,
        userSelect: 'none',
        transition: 'background 0.15s',
      }}
    >
      {s.label}
    </div>
  );
}

export default function PermissionsPage() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX.map(row => [...row]));
  const [toast, setToast] = useState(false);

  function handleChange(menuIdx, roleIdx, val) {
    setMatrix(m =>
      m.map((row, i) =>
        i === menuIdx
          ? row.map((v, j) => (j === roleIdx ? val : v))
          : row
      )
    );
  }

  function handleSave() {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <div>
      <div className="page-title">권한 설정</div>

      {/* 범례 */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginBottom: 20,
        fontSize: 12,
        alignItems: 'center',
        color: 'var(--gray-500)',
      }}>
        <span>범례:</span>
        {[
          { value: 2, label: '허용 (ON)' },
          { value: 1, label: '읽기전용 (HALF)' },
          { value: 0, label: '차단 (OFF)' },
        ].map(({ value, label }) => (
          <span key={value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TriCheckbox value={value} onChange={() => {}} />
            {label}
          </span>
        ))}
      </div>

      {/* 권한 매트릭스 테이블 */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 160 }}>메뉴</th>
                {ROLES.map(r => (
                  <th key={r} style={{ textAlign: 'center', minWidth: 80 }}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MENUS.map((menu, mi) => (
                <tr key={menu}>
                  <td style={{ fontWeight: 600 }}>{menu}</td>
                  {ROLES.map((_, ri) => (
                    <td key={ri} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TriCheckbox
                          value={matrix[mi][ri]}
                          onChange={val => handleChange(mi, ri, val)}
                        />
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
