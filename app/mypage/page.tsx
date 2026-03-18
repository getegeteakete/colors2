'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase/client';
import { Download, ExternalLink, Save, LogOut, Lock, Mail, Eye, EyeOff, FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { isViewMode, setViewMode, MOCK_MYPAGE_RESERVATIONS, MOCK_MYPAGE_PAYMENTS, MOCK_RESERVATION } from '@/lib/view-mode';

type User = { id: string; name: string; email: string; phone?: string; address?: string };

function LoginForm({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'setup'>('login');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');

  const handleSetup = async () => {
    if (newPw.length < 8) return toast.error('パスワードは8文字以上で入力してください');
    if (newPw !== newPwConfirm) return toast.error('パスワードが一致しません');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('パスワードを設定しました。ログインしてください。');
      setMode('login');
      setPassword('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return toast.error('メールアドレスとパスワードを入力してください');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === 'PASSWORD_NOT_SET') {
        setMode('setup');
        toast.info('初回ログインのためパスワードを設定してください');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', data.user.name);
      onLogin(data.user);
      toast.success(`${data.user.name}様、ログインしました`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'setup') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" />パスワードの設定</CardTitle>
            <CardDescription>初回ログインのためパスワードを設定してください（8文字以上）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">{email}</div>
            <div className="space-y-1.5">
              <Label>新しいパスワード</Label>
              <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="8文字以上" />
            </div>
            <div className="space-y-1.5">
              <Label>パスワード確認</Label>
              <Input type="password" value={newPwConfirm} onChange={e => setNewPwConfirm(e.target.value)} placeholder="もう一度入力" />
            </div>
            <Button className="w-full" onClick={handleSetup} disabled={loading}>
              {loading ? '設定中...' : 'パスワードを設定する'}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setMode('login')}>戻る</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>マイページへログイン</CardTitle>
          <CardDescription>予約時に登録したメールアドレスとパスワードでログインしてください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>メールアドレス</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" className="pl-9" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>パスワード</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type={showPw ? 'text' : 'password'} className="pl-9 pr-10" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="パスワード"
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            初めてログインする場合はメールアドレスを入力してパスワードを設定できます
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MypageDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountForm, setAccountForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState('');
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: resData } = await supabase
        .from('reservations').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (resData) setReservations(resData);
      const resIds = (resData || []).map((r: any) => r.id);
      if (resIds.length > 0) {
        const { data: payData } = await supabase
          .from('payments').select('*, reservations(*)').in('reservation_id', resIds).order('created_at', { ascending: false });
        if (payData) setPayments(payData);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAccountSave = async () => {
    if (!supabase) return;
    setAccountSaving(true);
    try {
      const { error } = await supabase.from('users')
        .update({ name: accountForm.name, phone: accountForm.phone, address: accountForm.address }).eq('id', user.id);
      if (error) throw error;
      localStorage.setItem('user_name', accountForm.name);
      toast.success('アカウント情報を更新しました');
    } catch { toast.error('更新に失敗しました'); }
    finally { setAccountSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (pwForm.next.length < 8) return toast.error('新しいパスワードは8文字以上で設定してください');
    if (pwForm.next !== pwForm.confirm) return toast.error('新しいパスワードが一致しません');
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: pwForm.next, current_password: pwForm.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('パスワードを変更しました');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (e: any) { toast.error(e.message); }
    finally { setPwLoading(false); }
  };

  const handlePdfDownload = async (paymentId: string, type: 'invoice' | 'receipt') => {
    setPdfLoading(`${paymentId}_${type}`);
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, type, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.open(data.url, '_blank');
    } catch (e: any) { toast.error(e.message); }
    finally { setPdfLoading(''); }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      reserved: { label: '予約済み', variant: 'default' },
      done: { label: '完了', variant: 'secondary' },
      estimated: { label: '見積済み', variant: 'secondary' },
      paid: { label: '支払済み', variant: 'default' },
      pending: { label: '入金待ち', variant: 'outline' },
      refunded: { label: '返金済み', variant: 'destructive' },
    };
    const s = map[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">読み込み中...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">マイページ</h1>
            <p className="text-muted-foreground mt-1">{user.name} 様</p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />ログアウト
          </Button>
        </div>

        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="reservations">予約履歴</TabsTrigger>
            <TabsTrigger value="payments">支払履歴</TabsTrigger>
            <TabsTrigger value="account">アカウント</TabsTrigger>
            <TabsTrigger value="password">パスワード</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card>
              <CardHeader><CardTitle>予約履歴</CardTitle><CardDescription>過去の予約一覧</CardDescription></CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">予約履歴がありません</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日時</TableHead><TableHead>種類</TableHead>
                          <TableHead>住所</TableHead><TableHead>ステータス</TableHead><TableHead>Zoom</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((res) => (
                          <TableRow key={res.id}>
                            <TableCell className="whitespace-nowrap">{res.date} {res.time?.slice(0,5)}</TableCell>
                            <TableCell>{res.type === 'onsite' ? '訪問調査' : 'Zoom相談'}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{res.address || '-'}</TableCell>
                            <TableCell>{getStatusBadge(res.status)}</TableCell>
                            <TableCell>
                              {res.zoom_url ? (
                                <a href={res.zoom_url} target="_blank" rel="noopener noreferrer"
                                  className="text-primary flex items-center gap-1 hover:underline text-sm">
                                  <ExternalLink className="h-3 w-3" />開く
                                </a>
                              ) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>支払履歴</CardTitle>
                <CardDescription>請求書・領収書をダウンロードできます。領収書は支払完了後に発行されます。</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">支払履歴がありません</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日付</TableHead><TableHead>予約日時</TableHead>
                          <TableHead>金額</TableHead><TableHead>ステータス</TableHead>
                          <TableHead>請求書</TableHead><TableHead>領収書</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((pay) => (
                          <TableRow key={pay.id}>
                            <TableCell className="whitespace-nowrap text-sm">
                              {new Date(pay.created_at).toLocaleDateString('ja-JP')}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm">
                              {pay.reservations?.date} {pay.reservations?.time?.slice(0,5)}
                            </TableCell>
                            <TableCell className="font-medium">¥{Number(pay.amount).toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(pay.status)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 px-2 h-8"
                                disabled={pdfLoading === `${pay.id}_invoice`}
                                onClick={() => handlePdfDownload(pay.id, 'invoice')}>
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                {pdfLoading === `${pay.id}_invoice` ? '生成中...' : 'ダウンロード'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              {pay.status === 'paid' ? (
                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 px-2 h-8"
                                  disabled={pdfLoading === `${pay.id}_receipt`}
                                  onClick={() => handlePdfDownload(pay.id, 'receipt')}>
                                  <Receipt className="h-3.5 w-3.5 mr-1" />
                                  {pdfLoading === `${pay.id}_receipt` ? '生成中...' : 'ダウンロード'}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground px-2">支払後に発行</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader><CardTitle>アカウント情報</CardTitle><CardDescription>登録情報を変更できます</CardDescription></CardHeader>
              <CardContent className="space-y-5 max-w-lg">
                <div className="space-y-1.5">
                  <Label>お名前</Label>
                  <Input value={accountForm.name} onChange={e => setAccountForm({ ...accountForm, name: e.target.value })} placeholder="例：山田 太郎" />
                </div>
                <div className="space-y-1.5">
                  <Label>メールアドレス</Label>
                  <Input value={user.email} disabled className="bg-muted cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground">メールアドレスは変更できません</p>
                </div>
                <div className="space-y-1.5">
                  <Label>電話番号</Label>
                  <Input value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} placeholder="例：090-1234-5678" />
                </div>
                <div className="space-y-1.5">
                  <Label>住所</Label>
                  <Input value={accountForm.address} onChange={e => setAccountForm({ ...accountForm, address: e.target.value })} placeholder="例：福岡市東区○○1-1-1" />
                </div>
                <Button onClick={handleAccountSave} disabled={accountSaving}>
                  <Save className="w-4 h-4 mr-2" />{accountSaving ? '保存中...' : '変更を保存'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader><CardTitle>パスワード変更</CardTitle><CardDescription>新しいパスワードは8文字以上で設定してください</CardDescription></CardHeader>
              <CardContent className="space-y-5 max-w-lg">
                <div className="space-y-1.5">
                  <Label>現在のパスワード</Label>
                  <Input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} placeholder="現在のパスワード" />
                </div>
                <div className="space-y-1.5">
                  <Label>新しいパスワード</Label>
                  <Input type="password" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} placeholder="8文字以上" />
                </div>
                <div className="space-y-1.5">
                  <Label>新しいパスワード（確認）</Label>
                  <Input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="もう一度入力" />
                </div>
                <Button onClick={handlePasswordChange} disabled={pwLoading}>
                  <Lock className="w-4 h-4 mr-2" />{pwLoading ? '変更中...' : 'パスワードを変更'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MypagePageContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const isView = typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode());

  useEffect(() => {
    if (isView) {
      setViewMode();
      setUser({ id: 'mock', name: MOCK_RESERVATION.users.name, email: MOCK_RESERVATION.users.email });
      setChecking(false);
      return;
    }
    const id = localStorage.getItem('user_id');
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    if (id && name && email) setUser({ id, name, email });
    setChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setUser(null);
    toast.success('ログアウトしました');
  };

  if (checking) return <div className="py-20 text-center text-muted-foreground">読み込み中...</div>;
  if (!user) return <div className="container mx-auto px-4 py-8"><LoginForm onLogin={setUser} /></div>;
  return <MypageDashboard user={user} onLogout={handleLogout} />;
}

export default function MypagePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <MypagePageContent />
    </Suspense>
  );
}
