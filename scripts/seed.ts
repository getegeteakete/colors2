import { createClient } from '@supabase/supabase-js';
import { format, addDays } from 'date-fns';

// 環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません。');
  console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 営業時間: 11:00-18:00、1時間ごと
const timeSlots = [
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

async function seedSchedules() {
  console.log('🌱 スケジュールデータを作成中...');
  console.log('📅 営業日: 火曜日、水曜日、木曜日');
  console.log('🕐 営業時間: 11:00～18:00（1時間枠）');

  const staffId = 'staff-001'; // デフォルトスタッフID
  const schedules: Array<{
    staff_id: string;
    date: string;
    time: string;
    available: boolean;
  }> = [];

  // 今日から60日分のスケジュールを作成
  for (let i = 0; i < 60; i++) {
    const date = addDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');

    // 火、水、木のみ（火=2, 水=3, 木=4）
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 2 && dayOfWeek !== 3 && dayOfWeek !== 4) {
      continue; // 火、水、木以外はスキップ
    }

    // 各時間枠を作成
    for (const time of timeSlots) {
      schedules.push({
        staff_id: staffId,
        date: dateStr,
        time: time,
        available: true,
      });
    }
  }

  // バッチで挿入（Supabaseの制限を考慮して100件ずつ）
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < schedules.length; i += batchSize) {
    const batch = schedules.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('schedules')
      .upsert(batch, {
        onConflict: 'staff_id,date,time',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error(`❌ エラーが発生しました (バッチ ${i / batchSize + 1}):`, error);
    } else {
      inserted += data?.length || 0;
      console.log(`✅ ${inserted}件のスケジュールを作成しました...`);
    }
  }

  console.log(`\n✨ 完了！合計 ${inserted}件のスケジュールを作成しました。`);
}

// 実行
seedSchedules()
  .then(() => {
    console.log('\n🎉 シード処理が完了しました！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ エラーが発生しました:', error);
    process.exit(1);
  });
