import { NextRequest, NextResponse } from 'next/server';
import { sendZoomReminderEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// このAPIは毎朝cronジョブ等から呼び出す想定
// 例: Vercel Cron / 外部スケジューラーで GET /api/email/reminder を実行
export async function GET(request: NextRequest) {
  try {
    // Authorization check (環境変数でAPIキーを設定)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 翌日のZoom相談予約を取得
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: reservations, error } = await supabaseAdmin
      .from('reservations')
      .select('*, users(*)')
      .eq('type', 'zoom')
      .eq('date', tomorrowStr)
      .eq('status', 'reserved');

    if (error) {
      console.error('Reminder fetch error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    if (!reservations || reservations.length === 0) {
      return NextResponse.json({ message: '翌日のZoom予約なし', sent: 0 });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const res of reservations) {
      try {
        await sendZoomReminderEmail({
          name: res.users?.name || 'お客様',
          email: res.users?.email || '',
          date: res.date,
          time: res.time,
          type: 'zoom',
          zoomUrl: res.zoom_url || undefined,
          content: res.content || '',
        });
        sent++;
      } catch (e: any) {
        errors.push(`${res.id}: ${e.message}`);
      }
    }

    return NextResponse.json({
      message: `リマインドメール送信完了`,
      sent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Reminder API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
