/**
 * 時間を1時間前後に変換するヘルパー関数
 */
export function getAdjacentHours(time: string): { prev: string | null; next: string | null } {
  const [hours, minutes] = time.split(':').map(Number);
  const currentHour = hours;

  // 前の時間（1時間前）
  const prevHour = currentHour - 1;
  const prev = prevHour >= 0 ? `${String(prevHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` : null;

  // 次の時間（1時間後）
  const nextHour = currentHour + 1;
  const next = nextHour <= 23 ? `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` : null;

  return { prev, next };
}

/**
 * 予約時間とその前後1時間の時間リストを取得
 */
export function getReservedTimeSlots(time: string): string[] {
  const slots = [time];
  const { prev, next } = getAdjacentHours(time);

  if (prev) slots.push(prev);
  if (next) slots.push(next);

  return slots;
}
