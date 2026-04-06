# WEJEMU Admin — 요구사항 명세서

> 작성일: 2026-04-03
> 프로젝트: WEJEMU ERP 어드민 시스템
> 브랜치: `claude/beautiful-mclean`

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 시스템명 | WEJEMU ERP 어드민 백오피스 |
| 목적 | 사업장 가입 현황·어드민 계정·로그인 이력·ERP 메뉴 사용 로그 관리 |
| 프레임워크 | React 18 + Vite |
| 라우팅 | React Router v6 (BrowserRouter) |
| 상태 관리 | React Context API (AuthContext) |
| 스타일 | CSS Variables + Inline Styles (CSS Modules 미사용) |
| 아이콘 | lucide-react |
| 데이터 | Mock 데이터 (백엔드 API 없음) |
| 지원 환경 | 데스크탑 전용 (min-width: 1280px) |
| 배포 | GitHub Pages (`/wejemu/` base path) |

---

## 2. 디자인 시스템 — Lumia 적용

### 2.1 컬러 팔레트

| 토큰 | 값 | 용도 |
|------|----|------|
| `--accent` | `#3498db` | 주 강조색 (버튼, 링크, 활성 상태) |
| `--accent-hover` | `#2471a3` | 호버 상태 |
| `--dark-bg` | `#1d222d` | 사이드바 배경 |
| `--color-bg` | `#f7fbfe` | 전체 페이지 배경 |
| `--color-text` | `#384046` | 기본 텍스트 |
| `--color-border` | `#DEE2E6` | 테두리 |

### 2.2 폰트

| 패밀리 | 용도 |
|--------|------|
| Roboto | 기본 본문 |
| Poppins | 라벨, 테이블 헤더, 섹션 타이틀 |
| Raleway | 페이지 타이틀, 모달 제목, 브랜드명 |

### 2.3 공통 컴포넌트 스타일 규칙

- **카드**: `border-radius: 10px`, `border-top: 3px solid #3498db` (KPI 카드)
- **버튼 포커스**: `box-shadow: 0 0 0 3px rgba(52,152,219,0.12)`
- **테이블 헤더**: 대문자 + Poppins + `letter-spacing: 0.03em`
- **테이블 행 hover**: `background: #EBF5FB`
- **모달 오버레이**: `backdrop-filter: blur(2px)`
- **토스트**: `background: #1d222d` (다크)

---

## 3. 레이아웃 구조

### 3.1 전체 레이아웃 (AdminLayout)

```
┌──────────────┬──────────────────────────────────┐
│              │  Topbar (height: 56px)            │
│  Sidebar     ├──────────────────────────────────┤
│  (220px)     │                                  │
│  dark #1d222d│  <Outlet /> (main content)       │
│              │  padding: 24px                   │
└──────────────┴──────────────────────────────────┘
```

### 3.2 Sidebar 요구사항

- 배경: `#1d222d` (Lumia 다크)
- 브랜드 영역 높이: 56px (Topbar와 정렬)
- 활성 메뉴: 좌측 `3px solid #3498db` 바 + `rgba(52,152,219,0.18)` 배경
- 비활성 메뉴 텍스트: `rgba(255,255,255,0.65)`
- 섹션 라벨: `rgba(255,255,255,0.30)`, 대문자, `letter-spacing: 0.10em`
- 가입 신청 승인 메뉴: 빨간 뱃지 (대기 건수 표시)
- 하단 푸터: "Lumia Design System" 텍스트

### 3.3 Topbar 요구사항

- 높이: 56px, `position: sticky; top: 0`
- 좌측: 현재 페이지 타이틀 (Raleway 폰트, 굵게)
- 우측: 사용자 아바타 + 이름 + 역할 뱃지 + 드롭다운 (이메일 / 로그아웃)
- 검색박스 없음
- 하단 그림자: `0 1px 4px rgba(52,152,219,0.07)`

---

## 4. 라우팅

| 경로 | 페이지 | 접근 제한 |
|------|--------|-----------|
| `/login` | LoginPage | 비로그인 전용 |
| `/signup` | SignupPage | 비로그인 전용 |
| `/` | → `/business/status` 리다이렉트 | — |
| `/admin/master` | MasterAccountPage | master 역할만 |
| `/admin/approval` | ApprovalPage | master, admin |
| `/admin/permissions` | PermissionsPage | master, admin |
| `/business/status` | BusinessStatusPage | 로그인 필수 |
| `/business/accounts` | BizAdminPage | 로그인 필수 |
| `/business/login-log` | LoginLogPage | 로그인 필수 |
| `/logs/erp-menu` | ErpMenuLogPage | 로그인 필수 |

- 미로그인 시 `/` 이하 접근 → `/login` 리다이렉트 (PrivateRoute)
- 로그인 후 `/login`, `/signup` 접근 → `/business/status` 리다이렉트

---

## 5. 인증 (AuthContext)

### 5.1 테스트 계정

| 이메일 | 비밀번호 | 역할 | 상태 | 로그인 가능 |
|--------|----------|------|------|------------|
| master@erp.kr | master1234 | master | active | ✅ |
| super@erp.kr | super1234 | admin | active | ✅ |
| lee@erp.kr | lee1234 | cs_manager | pending | ❌ 승인 대기 |
| deny1@erp.kr | deny1234 | — | rejected | ❌ 반려 |

### 5.2 로그인 처리 흐름

```
이메일 + 비밀번호 입력
  ├─ 일치 없음    → "이메일 또는 비밀번호가 올바르지 않습니다." (적색)
  ├─ pending     → 황색 얼럿: "가입 승인 대기 상태입니다."
  ├─ rejected    → 적색 얼럿: "가입 반려" + rejectReason
  └─ active      → localStorage 저장 → /business/status 이동
```

### 5.3 제약 사항

- ❌ 비밀번호 찾기 링크 없음
- ❌ 로그인 상태 유지 체크박스 없음
- ✅ 새로고침 후 localStorage에서 세션 복원

---

## 6. 공통 컴포넌트

### 6.1 Badge

뱃지 값에 따른 자동 색상 매핑:

| 값 | 배경 | 텍스트 |
|----|------|--------|
| 정상, success, 활성 | `#EAF3DE` | `#3B6D11` |
| 심사중, 미결제, 승인 대기 | `#FAEEDA` | `#854F0B` |
| 반려, 에러, danger | `#FCEBEB` | `#A32D2D` |
| 해지, 삭제, 정지 | `#F1EFE8` | `#5F5E5A` |
| 클라우드, ADMIN | `#E6F1FB` | `#185FA5` |
| 마스터, MASTER, 무료 | `#EBF5FB` | `#1A6FA3` |
| 설치형, CS | `#E1F5EE` | `#085041` |

### 6.2 Pagination

- Props: `page`, `totalCount`, `pageSize`, `pageSizeOptions`, `onPageChange`, `onPageSizeChange`
- 페이지당 건수 선택: 10 / 20 / 50 / 100 / 300
- 3구역 레이아웃: `[페이지당 N건 select]` `[페이지 버튼]` `[조회결과 N건]`
- 항상 렌더링 (단일 페이지여도 숨기지 않음)

### 6.3 ResizableTable

- Props: `columns[]`, `data[]`, `emptyText`
- **컬럼 정렬**: 헤더 클릭 → asc/desc 토글, ▲▼/⇅ 인디케이터
- **컬럼 리사이즈**: 헤더 우측 드래그 핸들로 너비 조절
- `columns` 항목: `{ key, label, width?, sortable?, align?, render? }`
- 데이터 없을 때 `emptyText` 메시지 표시

### 6.4 SearchPanel

- 배경: `#F8F9FA`, 테두리: 1px
- 내부 `search-row`: flex, gap 12px
- `search-label`: min-width 72px, Poppins 폰트

---

## 7. 페이지별 요구사항

### 7.1 BusinessStatusPage (사업장 현황)

**KPI 카드 4개:**
- 전체 사업장 / 정상 / 해지 / 미결제

**검색 패널 (3행 2컬럼 그리드):**
- 1행: 제품구분(채널·은행·상품서비스 드롭다운 3개) / 서비스유형(드롭다운 2개) + 고객구분(일반·무료 체크박스)
- 2행: 검색대상(드롭다운+입력) / 설치여부(설치·미설치 체크박스)
- 3행: 조회기간(드롭다운+from~to+[전체][당일]) / 상태(정상·해지·정지·일반·연체·활성화·휴폐업 체크박스)
- 버튼행: [조회][초기화] 우측 정렬

**파일저장 버튼:** 검색 패널 외부 우측 상단 (파란색 `btn-blue`)

**집계 바:**
- 전체 / 정상기관(설치/미설치) / 해지기관(중지/해지)

**테이블 컬럼 18개 (가로 스크롤 필수):**
체크박스 | 가입일자 | 설치일자 | 사업자번호 | 회사명 | 대표자 | 가입채널 | 상품명 | 서비스유형 | 상태 | 최종사용일자 | 고객구분 | 출금계좌등록여부 | 업태 | 종목 | 최초관리자 | 등록일시 | 수정일시

**제약:**
- ❌ 자동증빙 컬럼 없음
- ❌ 영업점 컬럼 없음
- ❌ 고객구분 VIP/파트너 없음 (일반/무료만)

---

### 7.2 BizAdminPage (사업장 관리자 계정)

**검색:**
- 조회기간 드롭다운: 등록일자 / 해지일자
- 검색대상: 사업자번호 / 사업장명 / 아이디 / 사용자명

**테이블 컬럼:**
등록일자 | 사업자번호 | 회사명 | 아이디 | 사용자명 | 연락처 | 이메일 | 상태 | 수정일시

**상태 구분:** 정상 / 해지 / 삭제

**제약:**
- ❌ 최근 로그인 컬럼 없음

---

### 7.3 LoginLogPage (로그인 이력)

**기간구분 동적 UI:**
- 일별: 날짜 1개 선택
- 기간별: from ~ to 날짜 선택
- 월별: 년 + 월 드롭다운

**검색 드롭다운:** 사업자번호 / 사업장명 / IP주소 / 아이디 / 사용자명

**집계 바:** 조회결과 N건 / 총 로그인 횟수 / 실패 횟수

**테이블 컬럼:**
가입일자 | 사업자번호 | 회사명 | 상품명 | 상태 | 로그인횟수 | 최종로그인일시

- 로그인횟수: 우측 정렬 + 굵게

---

### 7.4 ErpMenuLogPage (ERP 메뉴 사용 로그)

**검색:** 기간(from~to) + 사업자번호/회사명 검색

**테이블 컬럼:**
사업자번호 | 회사명 | 메뉴경로 | 액션 | 접속IP | 사용자명 | 일시

---

### 7.5 MasterAccountPage (마스터 계정)

**테이블 컬럼:**
체크박스 | 이름 | 이메일 | 역할 | 상태 | 등록일시 | 수정일시 | 관리

- 역할별 Badge 표시
- 관리 버튼: 수정

---

### 7.6 ApprovalPage (가입 신청 승인)

**탭:** 승인 대기 / 처리 완료

**승인 대기 탭:**
- 테이블 컬럼: 신청일시 | 이름 | 이메일 | 부서 | 신청 역할 | 신청 사유 | 처리
- 승인 클릭 → 역할 확정 모달 → [가입 승인] / [가입 반려] 버튼

**처리 완료 탭:**
- 추가 컬럼: 가입 승인일자 | 승인 처리자

**상태 업데이트:** 승인/반려 후 `useState`로 목록 즉시 업데이트 (API 없음)

---

### 7.7 PermissionsPage (권한 설정)

**6역할 × 10메뉴 매트릭스 체크박스:**

역할: 마스터 / 서브 어드민 / 고객센터(관리자) / 고객센터(사용자) / 상품 담당자 / 개발 담당자

메뉴: 사업장 현황 / 사업장 관리자 / 로그인 이력 / ERP 메뉴 로그 / 마스터 계정 / 가입 승인 / 권한 설정 / 공지 관리 / 통계 / 설정

**체크박스 3상태:**
- OFF: 빈 박스
- HALF: 연파란 채움 (`#EBF5FB`)
- ON: 파란 채움 (`#1A6FA3`) + 흰색 ✓

**저장 버튼 → 토스트 메시지 표시**

---

### 7.8 LoginPage

- 중앙 카드 레이아웃 (width: 400px)
- 로고: 파란 정사각형 `#3498db` + "W"
- 타이틀: "WEJEMU Admin" (Raleway)
- 테스트 계정 빠른 선택 버튼 4개
- ❌ 비밀번호 찾기 없음
- ❌ 로그인 상태 유지 체크박스 없음

---

### 7.9 SignupPage

- 3단계 스텝 표시: 기본정보 → 권한 신청 → 승인 대기
- 현재 2단계 고정 (권한 신청 화면)
- 입력: 이름 / 이메일 / 부서 / 신청 역할 / 신청 사유
- 제출 시 alert 후 `/login` 이동

---

## 8. Mock 데이터

| 파일 | 내용 |
|------|------|
| `mockUsers.js` | 어드민 계정 4종 (master, admin, pending, rejected) |
| `mockBusinesses.js` | 사업장 10건 + 관리자 계정 6건 |
| `mockLoginLogs.js` | 로그인 이력 6건 |
| `mockMenuLogs.js` | ERP 메뉴 사용 로그 5건 |

**절대 규칙:**
- Mock 데이터 컬럼 = UI 컬럼 100% 일치
- 모든 필터링은 프론트엔드 JS `filter/includes`로 처리
- 외부 API fetch 호출 없음

---

## 9. Figma 내보내기 (capture-figma.cjs)

### 9.1 목적
전체 8개 페이지를 Figma에서 편집 가능한 프레임으로 자동 생성

### 9.2 동작 방식
1. Puppeteer(Chrome headless)로 각 페이지 로딩
2. `extractPageNodes()` 브라우저 컨텍스트 함수로 DOM 트리 순회 (depth 12)
3. 3가지 노드 추출: `rect`(배경), `border`(테두리), `text`(텍스트)
4. Figma 플러그인 파일 3종 생성: `manifest.json`, `ui.html`, `code.js`

### 9.3 생성 파일 위치
```
figma-export/plugin/
  ├── manifest.json   — 플러그인 메타데이터
  ├── ui.html         — 플러그인 UI (버튼 + 진행 상태)
  └── code.js         — 843개 노드 JSON + Figma API 로직
```

### 9.4 Figma 설치 방법
1. Figma 데스크탑 앱 열기
2. 로고 클릭 → Plugins → Development → Import plugin from manifest
3. `figma-export/plugin/manifest.json` 선택
4. 플러그인 실행 → "모든 페이지 생성 (8개 프레임)" 클릭

### 9.5 추출 현황

| 페이지 | 노드 수 |
|--------|---------|
| 01 로그인 | 33개 |
| 02 사업장현황 | 33개 |
| 03 사업장관리자계정 | 151개 |
| 04 로그인이력 | 151개 |
| 05 ERP메뉴로그 | 195개 |
| 06 마스터계정 | 108개 |
| 07 가입신청승인 | 101개 |
| 08 권한설정 | 71개 |
| **합계** | **843개** |

---

## 10. 절대 금지 사항

| 항목 | 사유 |
|------|------|
| 비밀번호 찾기 링크 추가 | 명세 외 기능 |
| 로그인 상태 유지 체크박스 | 명세 외 기능 |
| 고객구분 VIP / 파트너 추가 | 일반·무료 2종만 허용 |
| 사업장 현황에 자동증빙 / 영업점 컬럼 | 명세 외 컬럼 |
| 사업장 관리자에 최근 로그인 컬럼 | 명세 외 컬럼 |
| 반응형 / 모바일 스타일 | 데스크탑 전용 |
| 외부 API fetch 호출 | Mock 데이터만 사용 |
| 다크모드 토글 | 명세 외 기능 |
| 임의 페이지·기능 추가 | TODO 주석으로만 표시 |

---

## 11. 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 빌드
npm run build

# Figma 플러그인 생성 (개발 서버 실행 중 필요)
node capture-figma.cjs
```

---

*문서 생성: Claude Code (claude/beautiful-mclean 브랜치 기준)*
