import { useState } from 'react';
import Badge from '../../components/common/Badge';

const INITIAL_PENDING = [
  { id: 1, name: '이관리', email: 'lee@erp.kr', dept: '고객지원팀', role: '고객센터(관리자)', reason: '고객사 문의 대응 업무를 위해 신청합니다.', date: '03.30' },
  { id: 2, name: '박개발', email: 'dev2@erp.kr', dept: '개발팀', role: '개발 담당자', reason: 'API 연동 테스트 및 디버깅을 위해 신청합니다.', date: '03.29' },
  { id: 3, name: '최상품', email: 'prod1@erp.kr', dept: '상품팀', role: '상품 담당자', reason: '상품 정보 관리 및 등록 업무를 위해 신청합니다.', date: '03.28' },
  { id: 4, name: '정마케팅', email: 'mkt1@erp.kr', dept: '마케팅팀', role: '마케팅 담당자', reason: '캠페인 현황 모니터링을 위해 신청합니다.', date: '03.27' },
];

const INITIAL_DONE = [
  { id: 10, name: '김CS담당', email: 'cs01@erp.kr', role: '고객센터(사용자)', result: '가입 승인', approvedAt: '2025.03.25 14:22', approver: '마스터관리자' },
  { id: 11, name: '이슈퍼', email: 'super@erp.kr', role: '관리자', result: '가입 승인', approvedAt: '2025.03.20 10:05', approver: '마스터관리자' },
  { id: 12, name: '홍거절', email: 'deny1@erp.kr', role: '마케팅 담당자', result: '반려', approvedAt: '—', approver: '마스터관리자' },
];

export default function ApprovalPage() {
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [done, setDone] = useState(INITIAL_DONE);
  const [modal, setModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState('original');
  const [rejectReason, setRejectReason] = useState('');
  const [modalStep, setModalStep] = useState('select'); // 'select' | 'reject'

  function openModal(item) {
    setModal(item);
    setSelectedRole('original');
    setRejectReason('');
    setModalStep('select');
  }

  function handleApprove() {
    const finalRole = selectedRole === 'original' ? modal.role : '관리자';
    const now = new Date();
    const approvedAt = now.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).replace(/\./g, '.').replace(/\s/g, ' ');

    setPending(p => p.filter(x => x.id !== modal.id));
    setDone(d => [{
      id: modal.id,
      name: modal.name,
      email: modal.email,
      role: finalRole,
      result: '가입 승인',
      approvedAt,
      approver: '마스터관리자',
    }, ...d]);
    setModal(null);
  }

  function handleRejectProceed() {
    if (modalStep === 'select') {
      setModalStep('reject');
      return;
    }
    setPending(p => p.filter(x => x.id !== modal.id));
    setDone(d => [{
      id: modal.id,
      name: modal.name,
      email: modal.email,
      role: modal.role,
      result: '반려',
      approvedAt: '—',
      approver: '마스터관리자',
    }, ...d]);
    setModal(null);
  }

  return (
    <div>
      <div className="page-title">가입 신청 승인</div>

      {/* KPI */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 600 }}>
        <div className="kpi-card">
          <div className="label">승인 대기</div>
          <div className="value" style={{ color: 'var(--amber-600)' }}>{pending.length}</div>
        </div>
        <div className="kpi-card">
          <div className="label">이번 달 승인</div>
          <div className="value">12</div>
        </div>
        <div className="kpi-card">
          <div className="label">반려</div>
          <div className="value" style={{ color: 'var(--red-600)' }}>2</div>
        </div>
      </div>

      {/* 탭 */}
      <div className="tab-bar">
        <div
          className={`tab-item${tab === 'pending' ? ' active' : ''}`}
          onClick={() => setTab('pending')}
        >
          승인 대기
          {pending.length > 0 && (
            <span style={{
              background: 'var(--amber-50)',
              color: 'var(--amber-600)',
              fontSize: 11,
              padding: '1px 6px',
              borderRadius: 10,
              fontWeight: 700,
            }}>{pending.length}</span>
          )}
        </div>
        <div
          className={`tab-item${tab === 'done' ? ' active' : ''}`}
          onClick={() => setTab('done')}
        >
          처리 완료
        </div>
      </div>

      {/* 승인 대기 탭 */}
      {tab === 'pending' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>신청자</th>
                <th>이메일</th>
                <th>소속</th>
                <th>신청 역할</th>
                <th style={{ maxWidth: 220 }}>신청 사유</th>
                <th>신청일</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    textAlign: 'center',
                    color: 'var(--gray-400)',
                    padding: 32,
                  }}>
                    대기 중인 신청이 없습니다.
                  </td>
                </tr>
              ) : pending.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.dept}</td>
                  <td><Badge value={item.role} /></td>
                  <td style={{
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.reason}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(item)}
                    >
                      가입 승인
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 처리 완료 탭 */}
      {tab === 'done' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>신청자</th>
                <th>이메일</th>
                <th>신청 역할</th>
                <th>처리 결과</th>
                <th>가입 승인일자</th>
                <th>승인 처리자</th>
              </tr>
            </thead>
            <tbody>
              {done.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td><Badge value={item.result} /></td>
                  <td>{item.approvedAt}</td>
                  <td>{item.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 승인/반려 모달 */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {modalStep === 'select' ? (
              <>
                <div className="modal-title">가입 승인 확정</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
                  <strong style={{ color: 'var(--color-text)' }}>{modal.name}</strong>{' '}
                  ({modal.email}) 님의 가입을 처리합니다.
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10 }}>
                  역할 확정
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input
                      type="radio"
                      name="role"
                      value="original"
                      checked={selectedRole === 'original'}
                      onChange={() => setSelectedRole('original')}
                    />
                    신청 역할 그대로 — <Badge value={modal.role} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                    />
                    관리자로 조정
                  </label>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger btn-sm" onClick={handleRejectProceed}>
                    가입 반려
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleApprove}>
                    가입 승인
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-title">반려 사유 입력</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>
                  반려 사유를 입력하면 신청자에게 전달됩니다.
                </div>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={4}
                  style={{ width: '100%' }}
                  placeholder="반려 사유를 입력하세요"
                />
                <div className="modal-footer">
                  <button className="btn btn-sm" onClick={() => setModalStep('select')}>이전</button>
                  <button className="btn btn-danger btn-sm" onClick={handleRejectProceed}>
                    반려 확인
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
