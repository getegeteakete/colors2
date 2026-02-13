'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileEdit,
  CreditCard,
  CheckCircle2,
  LayoutDashboard,
  User,
  ArrowRight,
} from 'lucide-react';
import { setViewMode, getViewModeSearch, MOCK_RESERVATION_ID, MOCK_SESSION_ID } from '@/lib/view-mode';

export default function ViewPage() {
  useEffect(() => {
    setViewMode();
  }, []);

  const q = getViewModeSearch();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              画面一覧
            </h1>
            <p className="text-muted-foreground">
              各画面へ移動して動作を確認できます
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">予約の流れ</CardTitle>
                <CardDescription>カレンダーから決済完了まで</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/reserve?${q}`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      予約カレンダー
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/reserve/form?${q}&date=2026-01-30&time=10:00`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <FileEdit className="h-4 w-4" />
                      予約フォーム
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/reserve/checkout?${q}&reservation_id=${MOCK_RESERVATION_ID}`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      決済画面
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/reserve/success?${q}&session_id=${MOCK_SESSION_ID}`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      予約完了
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">お客様向け</CardTitle>
                <CardDescription>マイページ</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/mypage?${q}`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      マイページ
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">管理画面</CardTitle>
                <CardDescription>ログイン後、ダッシュボード・予約・決済・スケジュール・設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/admin/login?${q}`}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      管理画面ログイン
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">
                  ログイン後はダッシュボード・予約一覧・決済一覧・スケジュール・設定の各画面をご確認ください。
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="ghost">トップページへ戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
