'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { isViewMode, setViewMode } from '@/lib/view-mode';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
        setViewMode();
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('view_mode', '1');
        toast.success('ログインに成功しました');
        router.push('/admin?view=1');
        setLoading(false);
        return;
      }

      // サーバーでパスワードを検証
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('admin_logged_in', 'true');
        toast.success('ログインに成功しました');
        router.push('/admin');
      } else {
        toast.error(data.error || 'パスワードが正しくありません');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f1] px-4">
      <Card className="w-full max-w-md border-[#c3c4c7] shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">管理画面ログイン</CardTitle>
          <CardDescription>
            株式会社COLORS 予約システム管理画面
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>※ デフォルトパスワードは環境変数で設定できます</p>
            <p className="mt-2 text-xs">
              <code className="bg-muted px-2 py-1 rounded">
                ADMIN_PASSWORD
              </code>
              または
              <code className="bg-muted px-2 py-1 rounded ml-1">
                NEXT_PUBLIC_ADMIN_PASSWORD
              </code>
            </p>
            <p className="mt-2 text-xs">デフォルト: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f0f0f1]"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
