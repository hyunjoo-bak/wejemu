const VARIANT_MAP = {
  success: { bg: '#EAF3DE', color: '#3B6D11' },
  정상: { bg: '#EAF3DE', color: '#3B6D11' },
  '가입 승인': { bg: '#EAF3DE', color: '#3B6D11' },
  warning: { bg: '#FAEEDA', color: '#854F0B' },
  심사중: { bg: '#FAEEDA', color: '#854F0B' },
  미결제: { bg: '#FAEEDA', color: '#854F0B' },
  danger: { bg: '#FCEBEB', color: '#A32D2D' },
  반려: { bg: '#FCEBEB', color: '#A32D2D' },
  에러: { bg: '#FCEBEB', color: '#A32D2D' },
  gray: { bg: '#F1EFE8', color: '#5F5E5A' },
  해지: { bg: '#F1EFE8', color: '#5F5E5A' },
  삭제: { bg: '#F1EFE8', color: '#5F5E5A' },
  정지: { bg: '#F1EFE8', color: '#5F5E5A' },
  blue: { bg: '#E6F1FB', color: '#185FA5' },
  클라우드: { bg: '#E6F1FB', color: '#185FA5' },
  하이브리드: { bg: '#E6F1FB', color: '#185FA5' },
  ADMIN: { bg: '#E6F1FB', color: '#185FA5' },
  purple: { bg: '#EEEDFE', color: '#3C3489' },
  마스터: { bg: '#EEEDFE', color: '#3C3489' },
  무료: { bg: '#EEEDFE', color: '#3C3489' },
  MASTER: { bg: '#EEEDFE', color: '#3C3489' },
  active: { bg: '#EEEDFE', color: '#3C3489' },
  teal: { bg: '#E1F5EE', color: '#085041' },
  설치형: { bg: '#E1F5EE', color: '#085041' },
  CS: { bg: '#E1F5EE', color: '#085041' },
  coral: { bg: '#FAECE7', color: '#712B13' },
  파트너: { bg: '#FAECE7', color: '#712B13' },
  pink: { bg: '#FBEAF0', color: '#72243E' },
  상품: { bg: '#FBEAF0', color: '#72243E' },
  pending: { bg: '#FAEEDA', color: '#854F0B' },
  rejected: { bg: '#FCEBEB', color: '#A32D2D' },
  일반: { bg: '#F5F4F0', color: '#3A3935' },
};

export default function Badge({ value, variant }) {
  const key = variant || value;
  const style = VARIANT_MAP[key] || { bg: '#F5F4F0', color: '#3A3935' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      whiteSpace: 'nowrap',
    }}>
      {value}
    </span>
  );
}
