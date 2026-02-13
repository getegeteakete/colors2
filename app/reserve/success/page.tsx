'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { isViewMode, setViewMode, MOCK_RESERVATION } from '@/lib/view-mode';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setReservation(MOCK_RESERVATION);
      return;
    }
    if (sessionId) {
      fetchReservation();
    }
  }, [sessionId, searchParams]);

  const fetchReservation = async () => {
    try {
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        return;
      }

      const { data: payment } = await supabase
        .from('payments')
        .select('*, reservations(*, users(*))')
        .eq('stripe_intent', sessionId)
        .single();

      if (payment) {
        setReservation(payment.reservations);
      }
    } catch (error) {
      console.error('Error fetching reservation:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle>決済が完了しました</CardTitle>
            <CardDescription>ご予約ありがとうございます</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservation && (
              <div>
                <h3 className="font-semibold mb-2">予約内容</h3>
                <p>日時: {reservation.date} {reservation.time}</p>
                <p>種類: {reservation.type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
                {reservation.zoom_url && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Zoom URL:</p>
                    <a
                      href={reservation.zoom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {reservation.zoom_url}
                    </a>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-4">
              <Link href="/mypage" className="flex-1">
                <Button className="w-full">マイページへ</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">ホームへ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <SuccessPageContent />
    </Suspense>
  );
}





