'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Save, Mail, Lock, Calendar, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 's@colors092.site',
    smtpHost: process.env.NEXT_PUBLIC_SMTP_HOST || '',
    smtpPort: process.env.NEXT_PUBLIC_SMTP_PORT || '587',
    operatingDays: '火,水,木',
    operatingHours: '11:00-18:00',
  });

  // リセット用state
  const [resetDialog, setResetDialog] = useState<'all' | 'schedules' | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleSave = () => {
    toast.success('設定を保存しました（現在は表示のみ）');
  };

  const handleReset = async () => {
    if (!resetPassword) return toast.error('パスワードを入力してください');
    setResetting(true);
    try {
      const target = resetDialog === 'all' ? 'all_test_data' : 'reset_schedules';
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, admin_password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
      setResetDialog(null);
      setResetPassword('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7]">
          <h2 className="text-base font-semibold text-[#23282d]">基本設定</h2>
        </div>
        <div className="p-5 space-y-6">
          {/* メール設定 */}
          <div>
            <h3 className="text-sm font-semibold text-[#23282d] mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              メール設定
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="adminEmail" className="text-[#23282d]">
                  管理者メールアドレス
                </Label>
                <Input
                  id="adminEmail"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
                <p className="text-xs text-[#646970] mt-1">
                  環境変数で設定されています（.env.local）
                </p>
              </div>
              <div>
                <Label htmlFor="smtpHost" className="text-[#23282d]">
                  SMTPホスト
                </Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
                <p className="text-xs text-[#646970] mt-1">
                  環境変数で設定されています（.env.local）
                </p>
              </div>
              <div>
                <Label htmlFor="smtpPort" className="text-[#23282d]">
                  SMTPポート
                </Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* 営業設定 */}
          <div>
            <h3 className="text-sm font-semibold text-[#23282d] mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              営業設定
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="operatingDays" className="text-[#23282d]">
                  営業日
                </Label>
                <Input
                  id="operatingDays"
                  value={settings.operatingDays}
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
                <p className="text-xs text-[#646970] mt-1">
                  現在: 火曜日、水曜日、木曜日（変更するにはコードを編集してください）
                </p>
              </div>
              <div>
                <Label htmlFor="operatingHours" className="text-[#23282d]">
                  営業時間
                </Label>
                <Input
                  id="operatingHours"
                  value={settings.operatingHours}
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
                <p className="text-xs text-[#646970] mt-1">
                  現在: 11:00～18:00（1時間枠、変更するにはコードを編集してください）
                </p>
              </div>
            </div>
          </div>

          {/* セキュリティ設定 */}
          <div>
            <h3 className="text-sm font-semibold text-[#23282d] mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              セキュリティ設定
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-[#23282d]">管理画面パスワード</Label>
                <Input
                  type="password"
                  value="••••••••"
                  className="mt-1 border-[#c3c4c7]"
                  disabled
                />
                <p className="text-xs text-[#646970] mt-1">
                  環境変数 <code className="bg-[#f6f7f7] px-1 rounded">ADMIN_PASSWORD</code>{' '}
                  で設定されています
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#c3c4c7]">
            <Button
              onClick={handleSave}
              className="bg-[#0073aa] hover:bg-[#005a87] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              設定を保存
            </Button>
            <p className="text-xs text-[#646970] mt-2">
              ※ 現在は表示のみです。実際の設定変更は環境変数ファイル（.env.local）を編集してください。
            </p>
          </div>
        </div>
      </div>

      {/* システム情報 */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7]">
          <h2 className="text-base font-semibold text-[#23282d]">システム情報</h2>
        </div>
        <div className="p-5">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#646970]">アプリケーション名</span>
              <span className="text-[#23282d]">COLORS 予約システム</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#646970]">バージョン</span>
              <span className="text-[#23282d]">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#646970]">フレームワーク</span>
              <span className="text-[#23282d]">Next.js 14</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#646970]">データベース</span>
              <span className="text-[#23282d]">Supabase</span>
            </div>
          </div>
        </div>
      </div>

      {/* データリセット */}
      <div className="bg-white border border-red-200 rounded shadow-sm">
        <div className="px-5 py-4 border-b border-red-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h2 className="text-base font-semibold text-red-700">データ管理</h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-[#646970]">
            テストデータの削除やスケジュールのリセットを行います。操作前に必ず内容を確認してください。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-red-200 rounded p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-sm text-[#23282d]">テストデータを全削除</span>
              </div>
              <p className="text-xs text-[#646970]">
                すべての予約・支払い・顧客情報を削除します。スケジュールは残ります。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setResetDialog('all')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                全データを削除する
              </Button>
            </div>
            <div className="border border-orange-200 rounded p-4 space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-sm text-[#23282d]">スケジュールをリセット</span>
              </div>
              <p className="text-xs text-[#646970]">
                スケジュールを削除して、本日から60日分（火・水・木）を再作成します。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                onClick={() => setResetDialog('schedules')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                スケジュールをリセット
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 確認ダイアログ */}
      <Dialog open={!!resetDialog} onOpenChange={() => { setResetDialog(null); setResetPassword(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {resetDialog === 'all' ? 'テストデータを全削除' : 'スケジュールをリセット'}
            </DialogTitle>
            <DialogDescription>
              {resetDialog === 'all'
                ? 'すべての予約・支払い・顧客情報が削除されます。この操作は取り消せません。'
                : 'スケジュールをすべて削除して60日分を再作成します。この操作は取り消せません。'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-red-50 border border-red-200 rounded px-4 py-3 text-sm text-red-800">
              ⚠️ 確認のため管理者パスワードを入力してください
            </div>
            <div className="space-y-1.5">
              <Label>管理者パスワード</Label>
              <Input
                type="password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                placeholder="パスワードを入力"
                onKeyDown={e => e.key === 'Enter' && handleReset()}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setResetDialog(null); setResetPassword(''); }}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={resetting}>
              {resetting ? '処理中...' : '実行する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
