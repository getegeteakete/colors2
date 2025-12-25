'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Mail, Lock, Calendar } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'yoyaku@colors092.site',
    smtpHost: process.env.NEXT_PUBLIC_SMTP_HOST || '',
    smtpPort: process.env.NEXT_PUBLIC_SMTP_PORT || '587',
    operatingDays: '火,水,木',
    operatingHours: '11:00-18:00',
  });

  const handleSave = () => {
    // 実際の実装では、API経由でサーバー側の設定を更新する
    toast.success('設定を保存しました（現在は表示のみ）');
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
    </div>
  );
}
