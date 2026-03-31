import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PENDING_COUNT = 4;

const NAV_SECTIONS = [
  {
    label: '인증',
    items: [
      { label: '로그인 페이지', to: '/login', newTab: true },
      { label: '회원가입 페이지', to: '/signup', newTab: true },
    ],
  },
  {
    label: '어드민 계정 관리',
    roles: ['master', 'admin'],
    items: [
      { label: '마스터 계정', to: '/admin/master', roles: ['master'] },
      { label: '가입 신청 승인', to: '/admin/approval', badge: PENDING_COUNT },
      { label: '권한 설정', to: '/admin/permissions' },
    ],
  },
  {
    label: '사업장 관리',
    items: [
      { label: '사업장 현황', to: '/business/status' },
      { label: '사업장 관리자 계정', to: '/business/accounts' },
      { label: '로그인 이력', to: '/business/login-log' },
    ],
  },
  {
    label: '로그 & 모니터링',
    items: [
      { label: 'ERP 메뉴 사용 로그', to: '/logs/erp-menu' },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  function isAllowed(item) {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  }

  function isSectionVisible(section) {
    if (!section.roles) return true;
    return section.roles.includes(user?.role);
  }

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'white',
      borderRight: '0.5px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '0.5px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--purple-800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 14, fontWeight: 700,
          }}>경</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--purple-900)' }}>경리나라 Admin</div>
            <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>v2.4.1</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_SECTIONS.map(section => {
          if (!isSectionVisible(section)) return null;
          const visibleItems = section.items.filter(isAllowed);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              <div style={{
                padding: '12px 16px 4px',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--gray-400)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {section.label}
              </div>
              {visibleItems.map(item => {
                const isActive = location.pathname === item.to;
                if (item.newTab) {
                  return (
                    <a
                      key={item.to}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkStyle(false)}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={linkStyle(isActive)}
                  >
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        background: 'var(--red-600)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 10,
                        padding: '1px 6px',
                      }}>{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function linkStyle(isActive) {
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: 13,
    color: isActive ? 'var(--purple-800)' : 'var(--gray-700)',
    background: isActive ? 'var(--purple-50)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--purple-800)' : '3px solid transparent',
    fontWeight: isActive ? 600 : 400,
    transition: 'background 0.15s',
    textDecoration: 'none',
    cursor: 'pointer',
  };
}
