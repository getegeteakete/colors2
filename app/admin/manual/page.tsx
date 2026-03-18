'use client';

import { useState } from 'react';
import { BookOpen, Calendar, CreditCard, Clock, Settings, ChevronDown, ChevronRight, Mail, Trash2, Search, CheckCircle, LogIn, User, FileText, Bell, Shield } from 'lucide-react';

type Section = {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  steps: {
    title: string;
    desc: string;
    tips?: string;
    warning?: string;
  }[];
};

const sections: Section[] = [
  {
    id: 'login',
    icon: <LogIn className="w-5 h-5" />,
    title: 'ログイン・ログアウト',
    color: 'bg-slate-600',
    steps: [
      {
        title: '管理画面へのアクセス',
        desc: 'ブラウザで https://colors-yoyaku.vercel.app/admin/login にアクセスします。パスワードを入力して「ログイン」ボタンを押してください。',
        tips: 'パスワードは「Colors2024!」です。忘れた場合はVercelの環境変数「ADMIN_PASSWORD」を確認してください。',
      },
      {
        title: 'ログアウト',
        desc: '左サイドバーの一番下にある「ログアウト」ボタンをクリックします。ブラウザを閉じてもセッションが残ることがあるため、使用後は必ずログアウトしてください。',
        warning: 'ログアウトせずにブラウザを閉じると、次回同じブラウザからアクセスした際に自動でログイン状態になる場合があります。',
      },
    ],
  },
  {
    id: 'dashboard',
    icon: <BookOpen className="w-5 h-5" />,
    title: 'ダッシュボード',
    color: 'bg-blue-600',
    steps: [
      {
        title: 'ダッシュボードの見方',
        desc: 'ログイン後に表示されるトップ画面です。「本日の予約件数」「今週の予約件数」「入金待ち件数」「完了件数」の4つの統計が確認できます。',
        tips: '数字をクリックすると、各管理画面に移動できます。毎朝ここを確認する習慣をつけると管理がしやすくなります。',
      },
    ],
  },
  {
    id: 'reservations',
    icon: <Calendar className="w-5 h-5" />,
    title: '予約管理',
    color: 'bg-indigo-600',
    steps: [
      {
        title: '予約一覧を確認する',
        desc: 'サイドバーの「予約管理」をクリックします。お客様名・日時・種類（訪問/Zoom）・ステータス・決済状況が一覧で表示されます。',
        tips: '上部の検索欄でお客様名やメールアドレスで絞り込めます。日付フィルターで特定の日の予約だけを表示することもできます。',
      },
      {
        title: '予約のステータスを変更する',
        desc: '各予約行の「ステータス」列にあるドロップダウンをクリックし、「予約済み」「見積済み」「完了」から選択します。選択すると即座に保存されます。',
        tips: '現地調査が終わったら「見積済み」→お客様と契約が完了したら「完了」に変更してください。',
      },
      {
        title: '予約の詳細を見る',
        desc: '各予約行の「詳細」ボタンをクリックすると、お客様の相談内容・写真・AI見積もり金額・Zoom URLなど詳細情報が確認できます。',
      },
      {
        title: '予約を削除する',
        desc: '各予約行の右側にある赤いゴミ箱アイコンをクリックします。確認ダイアログが表示されるので内容を確認して「削除する」を押します。',
        warning: '削除すると予約・支払い情報・お客様情報（他に予約がない場合）がすべて削除されます。この操作は取り消せません。テストデータの削除にのみ使用してください。',
      },
    ],
  },
  {
    id: 'payments',
    icon: <CreditCard className="w-5 h-5" />,
    title: '決済管理',
    color: 'bg-green-600',
    steps: [
      {
        title: '決済一覧を確認する',
        desc: 'サイドバーの「決済管理」をクリックします。上部に「合計金額」「入金済み」「入金待ち」のサマリーが表示されます。',
        tips: '支払方法（カード/銀行振込/PayPal）・ステータスでフィルタリングができます。',
      },
      {
        title: '銀行振込の入金を確認する（重要）',
        desc: '銀行振込でお客様が振り込んだ場合、実際の入金をご自身の銀行口座で確認してください。確認できたら、該当行の緑色の「入金確認」ボタンをクリックします。確認ダイアログでお客様名・金額・振込参考番号を確認して「入金を確認する」を押します。',
        tips: '入金が確認されると、お客様のマイページで領収書がダウンロードできるようになります。未確認の銀行振込がある場合は画面上部に黄色いアラートが表示されます。',
        warning: '銀行口座への実際の入金を確認してから「入金確認」ボタンを押してください。誤って押してしまった場合はステータスを「入金待ち」に戻すことができます。',
      },
      {
        title: 'カード・PayPal決済のステータス変更',
        desc: 'カード払いとPayPalはStripe経由で自動的に「入金済み」になります。手動でステータスを変更する場合は、ドロップダウンから選択してください。',
      },
      {
        title: '振込参考番号の確認',
        desc: '銀行振込の場合、お客様には「COL-XXXXXXXX」形式の振込参考番号が発行されます。銀行の振込明細とこの番号を照合して入金確認をしてください。',
        tips: '振込参考番号は決済一覧の「支払方法」列に表示されます。',
      },
    ],
  },
  {
    id: 'schedule',
    icon: <Clock className="w-5 h-5" />,
    title: 'スケジュール管理',
    color: 'bg-orange-600',
    steps: [
      {
        title: 'スケジュールの基本設定',
        desc: '営業日は火・水・木曜日、営業時間は11:00〜18:00（1時間枠）で設定されています。お客様はこの枠の中から予約日時を選択します。',
      },
      {
        title: '空き枠を確認する',
        desc: 'サイドバーの「スケジュール管理」をクリックします。週間カレンダー形式で各日の時間枠が表示されます。緑が空き枠、グレーが予約済み/利用不可です。',
      },
      {
        title: '特定の日時を休業にする',
        desc: 'カレンダー上の時間枠をクリックすると、空き↔利用不可を切り替えられます。祝日や出張などで対応できない日は、事前に「利用不可」に設定してください。',
        tips: '翌月分のスケジュールも事前に確認・整備しておくことをおすすめします。',
      },
      {
        title: 'スケジュールを追加する',
        desc: '「スケジュール追加」ボタンから、特定の日時に新しい枠を追加できます。通常営業日以外（月・金など）に対応する場合はここから追加してください。',
      },
    ],
  },
  {
    id: 'email',
    icon: <Mail className="w-5 h-5" />,
    title: 'メール通知の仕組み',
    color: 'bg-purple-600',
    steps: [
      {
        title: '自動送信されるメール一覧',
        desc: 'システムは以下のタイミングで自動的にメールを送信します：\n①予約完了時→お客様に予約確認メール（管理者にもBCCで届きます）\n②新規登録時→ウェルカムメール＋マイページ案内メール\n③Zoom相談の前日→リマインドメール',
        tips: 'すべてのメールはs@colors092.siteから送信されます。お客様からの返信もこのアドレスで受信します。',
      },
      {
        title: '管理者への通知メール',
        desc: '新規予約が入るたびにs@colors092.siteに通知メールが届きます。件名に「【新規予約】お客様名 - 日時」と表示されるので、すぐに内容が分かります。',
      },
    ],
  },
  {
    id: 'mypage',
    icon: <User className="w-5 h-5" />,
    title: 'お客様マイページについて',
    color: 'bg-teal-600',
    steps: [
      {
        title: 'マイページでできること',
        desc: 'お客様は https://colors-yoyaku.vercel.app/mypage からログインできます。予約履歴・支払い履歴の確認、請求書・領収書のダウンロード、アカウント情報の変更、パスワードの変更ができます。',
      },
      {
        title: '初回ログインの流れ',
        desc: 'お客様は予約時に登録したメールアドレスを入力してマイページにアクセスします。初回は「パスワードを設定してください」という画面が表示されるので、8文字以上のパスワードを設定してログインします。',
        tips: 'お客様からパスワードが分からないと問い合わせがあった場合は、マイページで初回ログイン手順（メールアドレスを入力→パスワード設定）を案内してください。',
      },
      {
        title: '領収書の発行について',
        desc: '領収書は決済ステータスが「入金済み」になってから発行可能になります。銀行振込の場合は「入金確認」ボタンを押した後にお客様が領収書をダウンロードできるようになります。',
      },
    ],
  },
  {
    id: 'security',
    icon: <Shield className="w-5 h-5" />,
    title: 'セキュリティ・注意事項',
    color: 'bg-red-600',
    steps: [
      {
        title: '管理者パスワードの管理',
        desc: '管理画面のパスワード（Colors2024!）は第三者に知られないよう厳重に管理してください。定期的にVercelの環境変数「ADMIN_PASSWORD」を変更することをお勧めします。',
        warning: 'パスワードはメールやSNSで送受信しないでください。',
      },
      {
        title: '本番環境での操作について',
        desc: 'このシステムは実際のお客様データを扱います。予約の削除・ステータス変更・入金確認などの操作は慎重に行ってください。',
        warning: '削除した予約データは復元できません。必要な情報は事前にメモしておいてください。',
      },
      {
        title: 'お客様情報の取り扱い',
        desc: 'お客様の氏名・住所・メールアドレスなどの個人情報は適切に管理し、業務目的以外には使用しないでください。',
      },
    ],
  },
];

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
      <button
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-[#f6f7f7] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className={`${section.color} text-white rounded-md p-2 flex-shrink-0`}>
          {section.icon}
        </div>
        <span className="text-base font-semibold text-[#23282d] flex-1">{section.title}</span>
        {open
          ? <ChevronDown className="w-5 h-5 text-[#646970]" />
          : <ChevronRight className="w-5 h-5 text-[#646970]" />
        }
      </button>

      {open && (
        <div className="border-t border-[#c3c4c7] divide-y divide-[#f0f0f0]">
          {section.steps.map((step, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#0073aa] text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#23282d] mb-1">{step.title}</p>
                  <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">{step.desc}</p>
                  {step.tips && (
                    <div className="mt-2 flex gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-800">
                      <span className="flex-shrink-0">💡</span>
                      <span>{step.tips}</span>
                    </div>
                  )}
                  {step.warning && (
                    <div className="mt-2 flex gap-2 bg-yellow-50 border border-yellow-300 rounded px-3 py-2 text-sm text-yellow-800">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>{step.warning}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManualPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = sections.filter(s =>
    searchQuery === '' ||
    s.title.includes(searchQuery) ||
    s.steps.some(step => step.title.includes(searchQuery) || step.desc.includes(searchQuery))
  );

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm px-5 py-5">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-[#0073aa]" />
          <h1 className="text-xl font-bold text-[#23282d]">管理画面 使用マニュアル</h1>
        </div>
        <p className="text-sm text-[#646970]">COLORS予約システムの管理画面の使い方をまとめています。項目をクリックすると詳細が表示されます。</p>

        {/* 検索 */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#646970]" />
          <input
            type="text"
            placeholder="キーワードで検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#c3c4c7] rounded text-sm focus:outline-none focus:border-[#0073aa]"
          />
        </div>
      </div>

      {/* クイックリンク */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Calendar className="w-4 h-4" />, label: '予約管理', href: '/admin/reservations', color: 'text-indigo-600' },
          { icon: <CreditCard className="w-4 h-4" />, label: '決済管理', href: '/admin/payments', color: 'text-green-600' },
          { icon: <Clock className="w-4 h-4" />, label: 'スケジュール', href: '/admin/schedule', color: 'text-orange-600' },
          { icon: <Settings className="w-4 h-4" />, label: '設定', href: '/admin/settings', color: 'text-slate-600' },
        ].map(item => (
          <a key={item.href} href={item.href}
            className="bg-white border border-[#c3c4c7] rounded shadow-sm px-4 py-3 flex items-center gap-2 hover:bg-[#f6f7f7] transition-colors">
            <span className={item.color}>{item.icon}</span>
            <span className="text-sm font-medium text-[#23282d]">{item.label}</span>
          </a>
        ))}
      </div>

      {/* マニュアルセクション */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm px-5 py-8 text-center text-[#646970]">
            「{searchQuery}」に一致する項目が見つかりませんでした
          </div>
        ) : (
          filtered.map(section => <SectionCard key={section.id} section={section} />)
        )}
      </div>

      {/* フッター */}
      <div className="bg-[#f6f7f7] border border-[#c3c4c7] rounded px-5 py-4 text-xs text-[#646970] text-center">
        COLORS予約システム 管理マニュアル｜ご不明な点はシステム担当者までお問い合わせください
      </div>
    </div>
  );
}
