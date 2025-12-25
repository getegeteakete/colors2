'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

type TimeSlot = {
  time: string;
  available: boolean;
};

type ScheduleData = {
  date: string;
  times: TimeSlot[];
};

export default function ReservePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      // Supabaseが設定されているかチェック
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        toast.error('Supabaseが設定されていません。.env.localファイルを確認してください。');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('available', true)
        .gte('date', format(new Date(), 'yyyy-MM-dd'))
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching schedules:', error);
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          toast.error('データベーステーブルが作成されていません。SETUP.mdを確認してください。');
        } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
          toast.error('Supabaseの認証情報が正しくありません。.env.localを確認してください。');
        } else {
          toast.error('スケジュールの取得に失敗しました: ' + error.message);
        }
        setLoading(false);
        return;
      }

      // Group by date
      const grouped: { [key: string]: TimeSlot[] } = {};
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (!grouped[item.date]) {
            grouped[item.date] = [];
          }
          grouped[item.date].push({
            time: item.time,
            available: item.available,
          });
        });

        const scheduleList: ScheduleData[] = Object.entries(grouped).map(([date, times]) => ({
          date,
          times: times.sort((a, b) => a.time.localeCompare(b.time)),
        }));

        setSchedules(scheduleList);
        console.log(`✅ ${scheduleList.length}日分のスケジュールを取得しました`);
      } else {
        console.log('⚠️ スケジュールデータが見つかりませんでした。npm run seed を実行してください。');
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimes = (date: Date | undefined): TimeSlot[] => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    const schedule = schedules.find((s) => s.date === dateStr);
    const times = schedule?.times || [];
    
    // 既に予約がある時間の前後1時間も除外する
    // これは予約フォーム送信時にスケジュールが更新されるため、ここでは通常不要だが
    // 念のためフィルタリング（availableがfalseのものは既に除外されている）
    return times;
  };

  const handleTimeSlotClick = (time: string) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    router.push(`/reserve/form?date=${dateStr}&time=${time}`);
  };

  const availableDates = schedules.map((s) => new Date(s.date));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 業務内容の説明 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>現地調査で対応可能な業務内容</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">塗装サービス</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>住宅の外壁や内装の塗装</li>
                  <li>施設の外装・内装塗装（商業施設・オフィスビルなど）</li>
                  <li>車体塗装</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">リフォームサービス</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>キッチンやバスルームのリフォーム</li>
                  <li>間取りの変更</li>
                  <li>収納の増設</li>
                  <li>その他住宅リフォーム全般</li>
                </ul>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mt-4">
              お客様のニーズに合わせた柔軟なプランニングを行います。まずは現地調査でお気軽にご相談ください。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>予約カレンダー</CardTitle>
            <CardDescription>空いている日時を選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">スケジュールを読み込んでいます...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  現在、空いている時間枠がありません。
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  スケジュールデータが設定されていない可能性があります。
                </p>
                <Link href="/">
                  <Button variant="outline">トップページに戻る</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return !schedules.some((s) => s.date === dateStr);
                    }}
                  />
                </div>
                <div>
                  {selectedDate ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {format(selectedDate, 'yyyy年MM月dd日')}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableTimes(selectedDate).map((slot) => (
                          <Button
                            key={slot.time}
                            variant={slot.available ? 'default' : 'outline'}
                            disabled={!slot.available}
                            onClick={() => handleTimeSlotClick(slot.time)}
                            className="w-full"
                          >
                            {slot.time}
                          </Button>
                        ))}
                        {getAvailableTimes(selectedDate).length === 0 && (
                          <p className="text-muted-foreground col-span-2 text-center py-4">
                            この日は空き枠がありません
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[300px]">
                      <p className="text-muted-foreground">日付を選択してください</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

