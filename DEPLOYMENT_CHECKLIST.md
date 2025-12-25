# 本番環境デプロイチェックリスト

## 🔴 必須設定（本番環境で必要）

### 1. Supabase
- [ ] 本番環境のSupabaseプロジェクトを作成（または既存を使用）
- [ ] データベーススキーマを適用（`001_initial_schema.sql`）
- [ ] 決済方法カラムを追加（`002_add_payment_method.sql`）
- [ ] Storageバケット `photos` を作成
- [ ] 3つのAPIキーを取得
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Stripe決済
- [ ] Stripeアカウントを作成
- [ ] **本番環境のAPIキー**を取得（`sk_live_...`, `pk_live_...`）
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Webhookエンドポイントを設定
  - URL: `https://your-domain.com/api/webhook/stripe`
  - イベント: `checkout.session.completed`
- [ ] Webhookシークレットを取得
  - `STRIPE_WEBHOOK_SECRET`

### 3. メール設定（Xサーバー）
- [ ] メールアドレス: `yoyaku@colors092.site` ✅（準備済み）
- [ ] メールパスワードを設定
- [ ] 環境変数を設定
  - `SMTP_HOST=smtp.xserver.jp`
  - `SMTP_PORT=587`
  - `SMTP_USER=yoyaku@colors092.site`
  - `SMTP_PASSWORD=your_email_password`

### 4. アプリケーション設定
- [ ] 本番環境のURLを設定
  - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
- [ ] 管理画面パスワードを設定
  - `ADMIN_PASSWORD=your_secure_password`

## 🟡 オプション設定

### 5. AI見積もり機能（OpenAI API）
- [ ] OpenAIアカウントを作成（https://platform.openai.com/）
- [ ] APIキーを取得
  - `OPENAI_API_KEY=sk-...`
- [ ] **注意**: APIキーが設定されていない場合、簡易計算で動作します

### 6. 銀行振り込み決済
- [ ] 振込先銀行情報を設定
  - `BANK_NAME=〇〇銀行`
  - `BANK_BRANCH=〇〇支店`
  - `BANK_ACCOUNT_TYPE=普通`（または当座）
  - `BANK_ACCOUNT_NUMBER=1234567`
  - `BANK_ACCOUNT_NAME=株式会社COLORS`
- [ ] **注意**: 銀行振り込みは手動確認が必要です（管理画面で確認）

### 7. Zoom API（オプション - Zoom相談機能を使う場合のみ）
- [ ] Zoom Developerアカウントを作成
- [ ] Server-to-Server OAuthアプリを作成
- [ ] 認証情報を取得
  - `ZOOM_ACCOUNT_ID`
  - `ZOOM_CLIENT_ID`
  - `ZOOM_CLIENT_SECRET`

## 📋 環境変数一覧（Vercelで設定）

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe（本番環境）
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Xサーバー SMTP
SMTP_HOST=smtp.xserver.jp
SMTP_PORT=587
SMTP_USER=yoyaku@colors092.site
SMTP_PASSWORD=your_email_password

# OpenAI API（オプション）
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# 銀行振り込み情報（オプション）
BANK_NAME=〇〇銀行
BANK_BRANCH=〇〇支店
BANK_ACCOUNT_TYPE=普通
BANK_ACCOUNT_NUMBER=1234567
BANK_ACCOUNT_NAME=株式会社COLORS

# Zoom API（オプション）
ZOOM_ACCOUNT_ID=xxxxxxxxxxxxx
ZOOM_CLIENT_ID=xxxxxxxxxxxxx
ZOOM_CLIENT_SECRET=xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
ADMIN_PASSWORD=your_secure_password
```

## ✅ デプロイ後の確認

1. **基本動作**
   - [ ] トップページが表示される
   - [ ] 予約カレンダーが表示される
   - [ ] 予約フォームが動作する

2. **AI見積もり**
   - [ ] AI見積もりが動作する（OPENAI_API_KEYが設定されている場合）
   - [ ] 簡易計算が動作する（OPENAI_API_KEYが設定されていない場合）

3. **決済**
   - [ ] クレジットカード決済が動作する
   - [ ] PayPal決済が動作する（Stripe経由）
   - [ ] 銀行振り込み情報が正しく表示される

4. **メール送信**
   - [ ] 予約確定メールが送信される
   - [ ] 管理者への通知メールが届く

5. **管理画面**
   - [ ] 管理画面にログインできる
   - [ ] 銀行振り込みの決済を確認・承認できる

## 🔐 セキュリティ

- [ ] すべての環境変数が正しく設定されている
- [ ] 機密情報（`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`）が本番環境で設定されている
- [ ] `.env.local` がGitにコミットされていない
- [ ] 管理画面パスワードが強力なパスワードになっている
