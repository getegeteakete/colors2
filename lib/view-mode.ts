/**
 * 画面一覧モード（ローカルで全画面を閲覧するためのモード）
 * URL の ?view=1 または sessionStorage の view_mode で判定
 */

export const VIEW_MODE_KEY = 'view_mode';

export function isViewMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === '1') return true;
  return sessionStorage.getItem(VIEW_MODE_KEY) === '1';
}

export function setViewMode(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(VIEW_MODE_KEY, '1');
}

export function getViewModeSearch(): string {
  return 'view=1';
}

/** 予約一覧用モック予約ID */
export const MOCK_RESERVATION_ID = 'view-reservation-1';
/** 決済完了画面用モックセッションID */
export const MOCK_SESSION_ID = 'view-session-1';

/** モック予約データ（予約フォームデモは2026年1月30日固定） */
export const MOCK_RESERVATION = {
  id: MOCK_RESERVATION_ID,
  date: '2026-01-30',
  time: '10:00',
  type: 'onsite',
  address: '福岡県福岡市東区和白1丁目1番35号',
  content: '外壁塗装の現地調査をご希望です。',
  status: 'reserved',
  users: {
    id: 'view-user-1',
    name: '山田 太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    address: '福岡県福岡市東区和白1丁目1番35号',
  },
};

/** モックスケジュール（予約カレンダー用・デモは2026年1月30日を含む） */
export const MOCK_SCHEDULES = [
  { date: '2026-01-30', times: [{ time: '09:00', available: true }, { time: '10:00', available: true }, { time: '14:00', available: true }] },
  { date: '2026-01-31', times: [{ time: '10:00', available: true }, { time: '11:00', available: true }] },
  { date: '2026-02-01', times: [{ time: '09:00', available: true }, { time: '15:00', available: true }] },
  { date: '2026-02-02', times: [{ time: '10:00', available: true }] },
  { date: '2026-02-03', times: [{ time: '14:00', available: true }, { time: '15:00', available: true }] },
];

/** 管理画面用モック統計 */
export const MOCK_ADMIN_STATS = {
  todayReservations: 3,
  weekReservations: 12,
  pendingPayments: 2,
  completedReservations: 28,
};

/** 管理画面用モック予約一覧 */
export const MOCK_ADMIN_RESERVATIONS = [
  { id: '1', date: '2026-01-30', time: '10:00', type: 'onsite', status: 'reserved', address: '福岡県福岡市東区和白1丁目1番35号', zoom_url: null, users: { name: '山田 太郎', email: 'yamada@example.com', phone: '090-1234-5678' }, payments: [{ id: '1', amount: 10000, status: 'paid' as const }] },
  { id: '2', date: '2026-01-31', time: '14:00', type: 'zoom', status: 'reserved', address: null, zoom_url: 'https://zoom.us/j/123456789', users: { name: '佐藤 花子', email: 'sato@example.com', phone: null }, payments: [{ id: '2', amount: 10000, status: 'pending' as const }] },
  { id: '3', date: '2026-02-01', time: '09:00', type: 'onsite', status: 'done', address: '福岡県福岡市博多区博多駅前1-1', zoom_url: null, users: { name: '鈴木 一郎', email: 'suzuki@example.com', phone: '090-9876-5432' }, payments: [{ id: '3', amount: 10000, status: 'paid' as const }] },
];

/** 管理画面用モック決済一覧 */
export const MOCK_ADMIN_PAYMENTS = [
  { id: '1', reservation_id: '1', amount: 10000, status: 'paid' as const, stripe_intent: 'cs_xxx', invoice_pdf_url: null, receipt_pdf_url: null, created_at: '2026-01-29T10:00:00', reservations: { id: '1', date: '2026-01-30', time: '10:00', type: 'onsite', users: { name: '山田 太郎', email: 'yamada@example.com' } } },
  { id: '2', reservation_id: '2', amount: 10000, status: 'pending' as const, stripe_intent: null, invoice_pdf_url: null, receipt_pdf_url: null, created_at: '2026-01-30T09:00:00', reservations: { id: '2', date: '2026-01-31', time: '14:00', type: 'zoom', users: { name: '佐藤 花子', email: 'sato@example.com' } } },
];

/** マイページ用モック予約一覧 */
export const MOCK_MYPAGE_RESERVATIONS = [
  { id: MOCK_RESERVATION_ID, date: '2026-01-30', time: '10:00', type: 'onsite', status: 'reserved', address: '福岡県福岡市東区和白1丁目1番35号', zoom_url: null },
];

/** マイページ用モック支払い一覧 */
export const MOCK_MYPAGE_PAYMENTS = [
  { id: '1', amount: 10000, status: 'paid', created_at: '2026-01-29T10:00:00', invoice_pdf_url: null, receipt_pdf_url: null, reservations: { date: '2026-01-30', time: '10:00' } },
];

/** 管理画面スケジュール用モック */
export const MOCK_ADMIN_SCHEDULES = [
  { id: '1', staff_id: 'staff-001', date: '2025-02-15', time: '11:00', available: true },
  { id: '2', staff_id: 'staff-001', date: '2025-02-15', time: '12:00', available: true },
  { id: '3', staff_id: 'staff-001', date: '2025-02-15', time: '14:00', available: false },
  { id: '4', staff_id: 'staff-001', date: '2025-02-16', time: '11:00', available: true },
  { id: '5', staff_id: 'staff-001', date: '2025-02-16', time: '13:00', available: true },
];
