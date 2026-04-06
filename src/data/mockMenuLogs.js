export const MOCK_MENU_LOGS = [
  { time: '10:14:38', bizNo: '123-45-67890', companyName: '㈜그린솔루션', task: '회계', menu: '전표 입력', user: '김민준', action: '저장', duration: '2.3s' },
  { time: '10:14:22', bizNo: '567-89-01234', companyName: 'KH정밀', task: '인사급여', menu: '급여 관리', user: '정하늘', action: '조회', duration: '0.8s' },
  { time: '10:13:55', bizNo: '234-56-78901', companyName: '하나무역', task: '영업', menu: '세금계산서', user: '이서연', action: '수정', duration: '1.4s' },
  { time: '10:13:41', bizNo: '123-45-67890', companyName: '㈜그린솔루션', task: '자금', menu: '자금 현황', user: '김민준', action: '조회', duration: '0.5s' },
  { time: '10:12:09', bizNo: '567-89-01234', companyName: 'KH정밀', task: '회계', menu: '결산 보고', user: '정하늘', action: '조회', duration: '3.1s' },
];

export const TASK_STATS = [
  { task: '회계',   count: 48201 },
  { task: '인사급여', count: 31445 },
  { task: '영업',   count: 25110 },
  { task: '자금',   count: 18340 },
  { task: '예산',   count: 8771  },
  { task: '공통',   count: 5930  },
];

export const BIZ_ACTIVITY = [
  { companyName: '㈜그린솔루션', monthCount: 3204, lastUse: '2025.03.31', activity: '매우활발' },
  { companyName: 'KH정밀',      monthCount: 2811, lastUse: '2025.03.31', activity: '매우활발' },
  { companyName: '하나무역',     monthCount: 1542, lastUse: '2025.03.30', activity: '활발' },
  { companyName: '대한물산',     monthCount: 980,  lastUse: '2025.03.29', activity: '보통' },
  { companyName: '블루텍코리아', monthCount: 412,  lastUse: '2025.03.29', activity: '보통' },
];
