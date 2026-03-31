import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const PAGE_TITLES = {
  '/admin/master': '마스터 계정',
  '/admin/approval': '가입 신청 승인',
  '/admin/permissions': '권한 설정',
  '/business/status': '사업장 현황',
  '/business/accounts': '사업장 관리자 계정',
  '/business/login-log': '로그인 이력',
  '/logs/erp-menu': 'ERP 메뉴 사용 로그',
};

const ROLE_LABELS = {
  master: 'MASTER',
  admin: 'ADMIN',
  cs_manager: 'CS',
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] || '';
  const roleLabel = ROLE_LABELS[user?.role] || '';

  return (
    <header style={{
      height: 56,
      background: 'white',
      borderBottom: '0.5px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{title}</div>

      {/* 검색창 (장식용) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--gray-100)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 8,
        padding: '0 12px',
        height: 32,
        width: 200,
        color: 'var(--gray-400)',
        fontSize: 12,
      }}>
        🔍 검색
      </div>

      {/* 사용자 */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--purple-800)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>
            {user?.avatar}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
          <Badge value={roleLabel} />
        </button>

        {open && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 199 }}
              onClick={() => setOpen(false)}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: 'white',
              border: '0.5px solid var(--color-border)',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              width: 160,
              zIndex: 200,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--gray-500)', borderBottom: '0.5px solid var(--color-border)' }}>
                {user?.email}
              </div>
              <button
                onClick={logout}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', fontSize: 13,
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--red-600)',
                }}
              >
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
