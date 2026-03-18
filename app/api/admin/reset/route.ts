import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, addDays } from 'date-fns';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { target, admin_password } = await request.json();

    // 管理者パスワード確認
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (admin_password !== adminPassword) {
      return NextResponse.json({ error: '管理者パスワードが正しくありません' }, { status: 401 });
    }

    if (target === 'all_test_data') {
      // 支払い→予約→ユーザーの順で削除
      await supabaseAdmin.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseAdmin.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      return NextResponse.json({ success: true, message: 'すべてのテストデータを削除しました' });
    }

    if (target === 'reset_schedules') {
      // スケジュールリセット＋60日分再投入
      await supabaseAdmin.from('schedules').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const times = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
      const schedules: any[] = [];

      for (let i = 0; i < 60; i++) {
        const date = addDays(new Date(), i);
        const dow = date.getDay();
        if (dow !== 2 && dow !== 3 && dow !== 4) continue;
        const dateStr = format(date, 'yyyy-MM-dd');
        times.forEach(time => {
          schedules.push({ staff_id: 'staff-001', date: dateStr, time, available: true });
        });
      }

      const batchSize = 100;
      for (let i = 0; i < schedules.length; i += batchSize) {
        await supabaseAdmin.from('schedules').upsert(schedules.slice(i, i + batchSize), {
          onConflict: 'staff_id,date,time',
          ignoreDuplicates: false,
        });
      }

      return NextResponse.json({ success: true, message: `スケジュールをリセットし${schedules.length}件を再作成しました` });
    }

    return NextResponse.json({ error: '不正なターゲットです' }, { status: 400 });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'リセットに失敗しました: ' + error.message }, { status: 500 });
  }
}
