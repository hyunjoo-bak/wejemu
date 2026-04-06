import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES = ['고객센터(관리자)', '고객센터(사용자)', '상품 담당자', '마케팅 담당자', '개발 담당자'];
const STEPS = ['기본정보', '권한 신청', '승인 대기'];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', dept: '', role: '', reason: '' });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('신청이 완료되었습니다. 마스터 관리자 승인 후 로그인 가능합니다.');
    navigate('/login');
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
        width: 480,
        background: 'white',
        border: '0.5px solid var(--color-border)',
        borderRadius: 16,
        padding: 40,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#3498db',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 10,
          }}>W</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1B4F72' }}>가입 신청</div>
        </div>

        {/* 스텝 표시 (현재 2단계: 권한 신청 고정) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: i === 1 ? '#3498db' : i < 1 ? 'var(--green-600)' : 'var(--gray-200)',
                  color: i <= 1 ? 'white' : 'var(--gray-500)',
                }}>
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 11,
                  color: i === 1 ? '#3498db' : 'var(--gray-400)',
                  fontWeight: i === 1 ? 600 : 400,
                }}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 60, height: 1,
                  background: 'var(--color-border)',
                  margin: '0 8px',
                  marginBottom: 20,
                }} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              이름 <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              이메일 <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">소속/부서</label>
            <input
              type="text"
              name="dept"
              className="form-control"
              value={form.dept}
              onChange={handleChange}
              placeholder="소속 또는 부서명을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              신청 권한 역할 <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">역할을 선택하세요</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              신청 사유 <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <textarea
              name="reason"
              className="form-control"
              value={form.reason}
              onChange={handleChange}
              placeholder="신청 사유를 입력하세요"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 40, fontSize: 14, marginTop: 4 }}
          >
            가입 승인 요청
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#2E86C1', fontWeight: 600 }}>
            로그인 →
          </Link>
        </div>
      </div>
    </div>
  );
}
