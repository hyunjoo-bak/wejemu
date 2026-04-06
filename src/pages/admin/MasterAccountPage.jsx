import { MOCK_USERS } from '../../data/mockUsers';
import Badge from '../../components/common/Badge';

const MASTER_INFO = {
  name: '마스터관리자',
  email: 'master@erp.kr',
  type: '내장 마스터',
  twoFa: true,
  lastLogin: '2025.03.31 10:14',
  loginIp: '192.168.1.100',
};

const MASTER_FEATURES = [
  '가입 신청 승인/반려',
  '모든 어드민 권한 조정',
  '시스템 설정 전체 접근',
  '감사 로그 전체 열람',
];

const ROLE_LABEL = {
  master: '마스터',
  admin: '서브 어드민',
  cs_manager: '고객센터(관리자)',
};

const STATUS_LABEL = {
  active: '활성',
  pending: '승인 대기',
  rejected: '반려',
};

export default function MasterAccountPage() {
  return (
    <div>
      <div className="page-title">마스터 계정</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 마스터 계정 정보 */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>마스터 계정 정보</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--purple-800)',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700,
            }}>MS</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{MASTER_INFO.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{MASTER_INFO.email}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoItem label="계정 유형" value={MASTER_INFO.type} />
            <InfoItem label="2단계 인증" value={<Badge value="ON" variant="success" />} />
            <InfoItem label="마지막 로그인" value={MASTER_INFO.lastLogin} />
            <InfoItem label="접속 IP" value={MASTER_INFO.loginIp} />
          </div>
        </div>

        {/* 마스터 전용 기능 */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>마스터 전용 기능</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MASTER_FEATURES.map(f => (
              <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'default' }}>
                <input
                  type="checkbox"
                  checked
                  readOnly
                  style={{ accentColor: 'var(--purple-800)', width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13 }}>{f}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 현재 어드민 계정 목록 */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>현재 어드민 계정 목록</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>상태</th>
                <th>마지막 로그인</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role ? <Badge value={ROLE_LABEL[u.role] || u.role} /> : '—'}</td>
                  <td>
                    <Badge
                      value={STATUS_LABEL[u.status] || u.status}
                      variant={u.status}
                    />
                  </td>
                  <td>{u.lastLogin}</td>
                  <td>
                    <button className="btn btn-sm" style={{ color: 'var(--purple-600)' }}>
                      권한 수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
