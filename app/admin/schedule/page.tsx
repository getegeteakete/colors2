'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import { isViewMode, setViewMode, MOCK_ADMIN_SCHEDULES } from '@/lib/view-mode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Schedule = {
  id: string;
  staff_id: string;
  date: string;
  time: string;
  available: boolean;
};

const timeSlots = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const operatingDays = [2, 3, 4]; // 火、水、木

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setSchedules(MOCK_ADMIN_SCHEDULES as Schedule[]);
      setLoading(false);
      return;
    }
    fetchSchedules();
  }, [currentDate, searchParams]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        return;
      }

      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 月曜日開始
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const startDateStr = format(weekStart, 'yyyy-MM-dd');
      const endDateStr = format(weekEnd, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      console.error('Error fetching schedules:', error);
      toast.error('スケジュールデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (scheduleId: string, currentStatus: boolean) => {
    try {
      if (!supabase) return;

      const { error } = await supabase
        .from('schedules')
        .update({ available: !currentStatus })
        .eq('id', scheduleId);

      if (error) throw error;
      toast.success('スケジュールを更新しました');
      fetchSchedules();
    } catch (error: any) {
      console.error('Error updating schedule:', error);
      toast.error('スケジュールの更新に失敗しました');
    }
  };

  const createSchedule = async (date: Date, time: string) => {
    try {
      if (!supabase) return;

      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = getDay(date);

      // 火、水、木以外は作成しない
      if (!operatingDays.includes(dayOfWeek)) {
        toast.error('火曜日、水曜日、木曜日のみ予約可能です');
        return;
      }

      const { error } = await supabase.from('schedules').insert({
        staff_id: 'staff-001',
        date: dateStr,
        time: time,
        available: true,
      });

      if (error) {
        if (error.code === '23505') {
          // 既に存在する場合は更新
          const { error: updateError } = await supabase
            .from('schedules')
            .update({ available: true })
            .eq('staff_id', 'staff-001')
            .eq('date', dateStr)
            .eq('time', time);

          if (updateError) throw updateError;
        } else {
          throw error;
        }
      }

      toast.success('スケジュールを作成しました');
      fetchSchedules();
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      toast.error('スケジュールの作成に失敗しました');
    }
  };

  const getScheduleForDateAndTime = (date: string, time: string) => {
    return schedules.find((s) => s.date === date && s.time === time);
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const getDayName = (date: Date) => {
    const day = getDay(date);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return dayNames[day];
  };

  const isOperatingDay = (date: Date) => {
    return operatingDays.includes(getDay(date));
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#23282d]">スケジュール管理</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="border-[#c3c4c7]"
            >
              今週に戻る
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
              className="border-[#c3c4c7]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
              className="border-[#c3c4c7]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSchedules}
              className="border-[#c3c4c7]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 text-sm text-[#646970]">
            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy年MM月dd日', {
              locale: ja,
            })}{' '}
            ～{' '}
            {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy年MM月dd日', {
              locale: ja,
            })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7]">
                  <th className="text-left p-3 text-sm font-semibold text-[#23282d] w-24">時間</th>
                  {weekDays.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`text-center p-3 text-sm font-semibold border-l border-[#c3c4c7] ${
                        isOperatingDay(day) ? 'text-[#23282d]' : 'text-[#646970]'
                      }`}
                    >
                      <div>{format(day, 'MM/dd', { locale: ja })}</div>
                      <div className="text-xs font-normal">({getDayName(day)})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="border-b border-[#c3c4c7]">
                    <td className="p-3 text-sm text-[#23282d] font-medium">{time}</td>
                    {weekDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const schedule = getScheduleForDateAndTime(dateStr, time);
                      const isOperating = isOperatingDay(day);

                      return (
                        <td
                          key={`${dateStr}-${time}`}
                          className="p-2 text-center border-l border-[#c3c4c7]"
                        >
                          {isOperating ? (
                            schedule ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAvailability(schedule.id, schedule.available)}
                                className={`w-full h-8 ${
                                  schedule.available
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {schedule.available ? '○' : '×'}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => createSchedule(day, time)}
                                className="w-full h-8 border-[#c3c4c7] text-[#646970]"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )
                          ) : (
                            <span className="text-[#c3c4c7]">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-[#646970]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>予約可能</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>予約不可</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c3c4c7]">-</span>
              <span>営業日外</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
