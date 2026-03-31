import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('master@erp.kr');
  const [password, setPassword] = useState('master1234');
  const [error, setError] = useState(null);

  const TEST_ACCOUNTS = [
    { label: '마스터', email: 'master@erp.kr', password: 'master1234' },
    { label: '서브 어드민', email: 'super@erp.kr', password: 'super1234' },
    { label: '승인 대기', email: 'lee@erp.kr', password: 'lee1234' },
    { label: '반려', email: 'deny1@erp.kr', password: 'deny1234' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const result = login(email, password);
    if (result.success) {
      navigate('/business/status', { replace: true });
    } else {
      setError(result);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        width: 400,
        background: 'white',
        border: '0.5px solid var(--color-border)',
        borderRadius: 16,
        padding: 40,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--purple-800)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 22, fontWeight: 700,
            marginBottom: 12,
          }}>경</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--purple-900)' }}>경리나라 Admin</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>백오피스 관리 시스템</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && error.type === 'not_found' && (
            <div className="alert-error" style={{ marginBottom: 12 }}>
              이메일 또는 비밀번호가 올바르지 않습니다.
            </div>
          )}
          {error && error.type === 'pending' && (
            <div className="alert alert-warning">
              가입 승인 대기 상태입니다. 관리자에게 문의하세요.
            </div>
          )}
          {error && error.type === 'rejected' && (
            <div className="alert alert-danger">
              <div style={{ fontWeight: 600, marginBottom: 6 }}>가입 반려되어 로그인 제한됩니다.</div>
              <div style={{ fontSize: 12 }}>{error.rejectReason}</div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 40, fontSize: 14, marginTop: 4 }}>
            로그인
          </button>
        </form>

        {/* 테스트 계정 빠른 선택 */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '0.5px solid var(--color-border)' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 8, textAlign: 'center' }}>
            테스트 계정 빠른 선택
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {TEST_ACCOUNTS.map(a => (
              <button
                key={a.email}
                type="button"
                onClick={() => { setEmail(a.email); setPassword(a.password); setError(null); }}
                className="btn btn-sm"
                style={{
                  fontSize: 11,
                  background: email === a.email ? 'var(--purple-50)' : 'white',
                  borderColor: email === a.email ? 'var(--purple-400)' : 'var(--color-border)',
                  color: email === a.email ? 'var(--purple-800)' : 'var(--gray-500)',
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--gray-400)' }}>
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: 'var(--purple-600)', fontWeight: 600 }}>
            가입 신청 →
          </Link>
        </div>
      </div>
    </div>
  );
}
