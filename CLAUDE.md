# CLAUDE.md — 경리나라 ERP 어드민 시스템

> Claude Code가 이 파일을 자동으로 읽습니다.
> 작업 전 반드시 이 파일 전체를 숙지하세요.

---

## 프로젝트 개요

**경리나라 ERP 신상품**의 어드민 관리 시스템입니다.
사업장 가입 현황, 어드민 계정 관리, 로그인 이력, ERP 메뉴 사용 로그 등을 관리하는
**백오피스 웹 애플리케이션**입니다.

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 18 + Vite |
| 라우팅 | React Router v6 |
| 상태 관리 | React Context API |
| 스타일 | CSS Modules (또는 Tailwind CSS) |
| 아이콘 | lucide-react |
| 데이터 | Mock 데이터 (백엔드 없음) |
| 지원 환경 | 데스크탑 전용 (min-width: 1280px) |

---

## 절대 규칙 (위반 금지)

1. **Mock 데이터 컬럼과 UI 컬럼이 100% 일치**해야 한다. 빠진 항목 없음.
2. **백엔드 API 호출 없음** — 모든 필터링은 프론트엔드 JS filter/includes로 처리.
3. **비밀번호 찾기 없음**, **로그인 상태 유지 체크박스 없음** — 로그인 페이지에 절대 추가하지 말 것.
4. **고객구분은 일반/무료 2종만** — VIP, 파트너 등 다른 값 사용 금지.
5. **자동증빙, 영업점 항목 없음** — 사업장 현황에 추가하지 말 것.
6. **테이블 가로 스크롤 필수** — 컬럼이 많은 테이블(사업장 현황 등)은 overflow-x: auto.
7. **반응형 불필요** — 모바일 대응 코드 추가하지 말 것.
8. **임의로 기능 추가하지 말 것** — 명세서에 없는 기능은 TODO 주석으로만 표시.

---

## 디렉토리 구조

```
src/
├── App.jsx                      # 라우터 설정
├── main.jsx
├── context/
│   └── AuthContext.jsx          # 전역 인증 상태 (로그인 유저 정보, login/logout 함수)
├── data/
│   ├── mockUsers.js             # 어드민 계정 4종
│   ├── mockBusinesses.js        # 사업장 10건 + 관리자 계정 6건
│   ├── mockLoginLogs.js         # 로그인 이력 6건
│   └── mockMenuLogs.js          # ERP 메뉴 사용 로그 5건
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── AdminLayout.jsx
│   └── common/
│       ├── Badge.jsx
│       ├── Pagination.jsx
│       └── SearchPanel.jsx
└── pages/
    ├── auth/
    │   ├── LoginPage.jsx
    │   └── SignupPage.jsx
    ├── admin/
    │   ├── MasterAccountPage.jsx
    │   ├── ApprovalPage.jsx
    │   └── PermissionsPage.jsx
    ├── business/
    │   ├── BusinessStatusPage.jsx
    │   ├── BizAdminPage.jsx
    │   └── LoginLogPage.jsx
    └── logs/
        └── ErpMenuLogPage.jsx
```

---

## 라우팅

```
/login                → LoginPage        (비로그인 전용, 로그인 시 /business/status 리다이렉트)
/signup               → SignupPage       (비로그인 전용)
/                     → /business/status 리다이렉트
/admin/master         → MasterAccountPage
/admin/approval       → ApprovalPage
/admin/permissions    → PermissionsPage
/business/status      → BusinessStatusPage   ← 로그인 후 첫 화면
/business/accounts    → BizAdminPage
/business/login-log   → LoginLogPage
/logs/erp-menu        → ErpMenuLogPage
```

- 미로그인 상태에서 `/` 이하 접근 → `/login` 리다이렉트
- PrivateRoute 컴포넌트로 보호

---

## 인증 (AuthContext)

```js
// context/AuthContext.jsx 가 제공하는 것
const { user, login, logout } = useAuth();

// user 구조
{
  id, name, email, role, status, avatar
}

// role 종류
"master"      // 마스터 (전체 접근)
"admin"       // 서브 어드민
"cs_manager"  // 고객센터(관리자)
```

- `login(email, password)` → MOCK_USERS에서 검증 → 성공 시 localStorage 저장
- `logout()` → localStorage 삭제 → `/login` 리다이렉트
- 앱 초기화 시 localStorage에서 복원 (새로고침 후 유지)

---

## 테스트 계정

| 이메일 | 비밀번호 | 역할 | 상태 | 로그인 가능 |
|--------|----------|------|------|------------|
| master@erp.kr | master1234 | 마스터 | active | O |
| super@erp.kr | super1234 | 서브 어드민 | active | O |
| lee@erp.kr | lee1234 | 고객센터(관리자) | pending | X (승인 대기) |
| deny1@erp.kr | deny1234 | — | rejected | X (반려) |

---

## 로그인 처리 로직

```
이메일+비밀번호 입력 → 로그인 버튼 클릭
  ├─ 일치 계정 없음    → "이메일 또는 비밀번호가 올바르지 않습니다." (빨간 메시지)
  ├─ status=pending   → 황색 얼럿: "가입 승인 대기 상태입니다. 관리자에게 문의하세요."
  ├─ status=rejected  → 적색 얼럿: "가입 반려되어 로그인 제한됩니다." + rejectReason 텍스트
  └─ status=active    → AuthContext 저장 → /business/status 이동
```

---

## Sidebar 메뉴 구조

```
── 인증 ──────────────────────
  로그인 페이지     /login
  회원가입 페이지   /signup

── 어드민 계정 관리 ─────────
  마스터 계정       /admin/master
  가입 신청 승인    /admin/approval    [뱃지: 대기 건수]
  권한 설정         /admin/permissions

── 사업장 관리 ──────────────
  사업장 현황       /business/status
  사업장 관리자 계정 /business/accounts
  로그인 이력       /business/login-log

── 로그 & 모니터링 ──────────
  ERP 메뉴 사용 로그  /logs/erp-menu
```

활성 메뉴: `useLocation()`으로 현재 경로 비교 → 보라색 좌측 3px 바 + 배경색 변경

---

## 핵심 페이지별 체크리스트

### BusinessStatusPage (사업장 현황)
- [ ] KPI 카드 4개: 전체 / 정상 / 해지 / 미결제
- [ ] 검색 패널 1행: 제품구분(채널+은행+상품서비스 드롭다운 3개) / 서비스유형(드롭다운 2개) / 고객구분(일반·무료 체크박스)
- [ ] 검색 패널 2행: 검색대상(드롭다운+입력) / 설치여부(설치·미설치 체크박스)
- [ ] 검색 패널 3행: 조회기간 드롭다운(가입/설치/해지/정지/최종사용일자) + from~to + [전체][당일] / 상태 체크박스(정상·해지·정지·일반·연체·활성화·휴폐업)
- [ ] 버튼행: [조회][초기화] 좌측 / [파일저장] 파란색 우측
- [ ] 집계 요약 바: 전체 / 정상기관(설치/미설치) / 해지기관(중지/해지)
- [ ] 테이블 컬럼 18개 (가로 스크롤): 체크박스|가입일자|설치일자|사업자번호|회사명|대표자|가입채널|상품명|서비스유형|상태|최종사용일자|고객구분|출금계좌등록여부|업태|종목|최초관리자|등록일시|수정일시

### LoginLogPage (로그인 이력)
- [ ] 기간구분 드롭다운: 일별(날짜1개) / 기간별(from~to) / 월별(년+월 드롭다운) — 동적 UI 변환
- [ ] 검색 드롭다운: 사업자번호/사업장명/IP주소/아이디/사용자명
- [ ] 집계 바: 조회결과 N건 / 총 로그인 횟수 / 실패 횟수
- [ ] 테이블 컬럼: 가입일자|사업자번호|회사명|상품명|상태|로그인횟수|최종로그인일시
- [ ] 로그인 횟수 우측 정렬 + 굵게

### ApprovalPage (가입 신청 승인)
- [ ] 탭: 승인 대기 / 처리 완료
- [ ] 승인 클릭 → 역할 확정 모달 → 가입 승인 / 가입 반려 버튼
- [ ] 처리 완료 탭: 가입 승인일자 + 승인 처리자 컬럼 포함
- [ ] 승인/반려 후 useState로 목록 즉시 업데이트

### BizAdminPage (사업장 관리자 계정)
- [ ] 조회 기간 드롭다운: 등록일자 / 해지일자
- [ ] 최근 로그인 컬럼 없음
- [ ] 상태 구분: 정상 / 해지 / 삭제

### PermissionsPage (권한 설정)
- [ ] 체크박스 3상태: ON(보라 채움) / HALF(연보라 채움) / OFF(빈 박스)
- [ ] 6역할 × 10메뉴 매트릭스
- [ ] 저장 버튼 → 토스트 메시지

---

## 뱃지 색상 규칙 (Badge.jsx)

| 값 | 배경 | 텍스트 |
|----|------|--------|
| 정상, success | #EAF3DE | #3B6D11 |
| 심사중, 미결제, warning | #FAEEDA | #854F0B |
| 반려, 에러, danger | #FCEBEB | #A32D2D |
| 해지, 삭제, gray | #F1EFE8 | #5F5E5A |
| 클라우드, blue | #E6F1FB | #185FA5 |
| 마스터, 무료, purple | #EEEDFE | #3C3489 |
| 설치형, CS, teal | #E1F5EE | #085041 |
| 가입 승인, green | #EAF3DE | #3B6D11 |

---

## 자주 하는 실수 방지

```
❌ 로그인 페이지에 "비밀번호 찾기" 링크 추가
❌ 로그인 페이지에 "로그인 상태 유지" 체크박스 추가
❌ 고객구분에 "VIP" 또는 "파트너" 추가
❌ 사업장 현황에 "자동증빙" 또는 "영업점" 컬럼 추가
❌ 사업장 관리자 계정에 "최근 로그인" 컬럼 추가
❌ 임의로 다크모드, 반응형 스타일 추가
❌ 외부 API fetch 호출 (모든 데이터는 Mock)
❌ 명세에 없는 페이지나 기능 임의 추가
```

---

## 개발 시작 전 확인사항

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
# → http://localhost:5173

# 3. 빌드 확인
npm run build
```

새 파일 생성 시 반드시 위 디렉토리 구조 위치에 맞게 생성할 것.
컴포넌트 추가 후 App.jsx 라우트 등록 여부 확인할 것.
