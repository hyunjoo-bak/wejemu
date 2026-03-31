import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: 'var(--purple-600)', fontWeight: 600 }}>
            가입 신청 →
          </Link>
        </div>
      </div>
    </div>
  );
}
