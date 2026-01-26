# 本番環境セットアップガイド

本格稼働させるために必要な情報とセットアップ手順をまとめました。

## 📋 必要な情報・設定一覧

### ✅ 既に準備済み
- **メールアドレス**: `yoyaku@colors092.site`
- **メールパスワード**: （Xサーバーのサーバーパネルで設定）

### 🔴 本番環境で必要な情報（準備が必要）

#### 1. Supabase（データベース）

**開発環境と同じプロジェクトを使う場合:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - 既存のSupabaseプロジェクトURL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 既存のanon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - 既存のservice_role key

**新しく本番用プロジェクトを作る場合:**
1. Supabaseで新しいプロジェクトを作成（本番用）
2. `supabase/migrations/001_initial_schema.sql` を実行
3. Storageバケット `photos` を作成
4. 上記の3つのキーを取得

#### 2. Stripe（決済）

**本番環境のStripeアカウントが必要:**
- [ ] Stripeアカウントを作成（https://stripe.com/）
- [ ] **本番環境のAPIキー**を取得：
  - `STRIPE_SECRET_KEY` - シークレットキー（sk_live_...）
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - 公開キー（pk_live_...）
- [ ] Webhookエンドポイントを設定（後述）

**Stripe Webhook設定:**
1. Stripeダッシュボード → Developers → Webhooks
2. 「Add endpoint」をクリック
3. Endpoint URL: `https://your-domain.com/api/webhook/stripe`
4. イベント: `checkout.session.completed` を選択
5. Webhookシークレットを取得 → `STRIPE_WEBHOOK_SECRET`

#### 3. Zoom API（オプション - Zoom相談機能を使う場合のみ）

- [ ] Zoom Developerアカウントを作成（https://marketplace.zoom.us/）
- [ ] Server-to-Server OAuth アプリを作成
- [ ] 以下の情報を取得：
  - `ZOOM_ACCOUNT_ID`
  - `ZOOM_CLIENT_ID`
  - `ZOOM_CLIENT_SECRET`

**注意**: Zoom APIを使わない場合は、これらの環境変数は設定不要です。

#### 4. アプリケーション設定

- [ ] **本番環境のURL** - `NEXT_PUBLIC_APP_URL`
  - 例: `https://yoyaku.colors092.site` または `https://your-domain.com`
- [ ] **管理画面パスワード** - `ADMIN_PASSWORD`
  - 推奨: 強力なパスワードを設定

#### 5. ドメイン・ホスティング

**推奨: Vercel（無料プランで利用可能）**

- [ ] Vercelアカウントを作成（https://vercel.com/）
- [ ] GitHub/GitLab/Bitbucketにコードをプッシュ
- [ ] Vercelでプロジェクトをインポート
- [ ] 環境変数を設定（後述）

**独自ドメインを使う場合:**
- [ ] ドメインを取得
- [ ] DNS設定（Vercelの指示に従う）
- [ ] SSL証明書はVercelが自動発行（無料）

---

## 🚀 デプロイ手順（Vercel推奨）

### Step 1: コードをGitリポジトリにプッシュ

```bash
# Gitリポジトリの初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHub/GitLab/Bitbucketにプッシュ
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Vercelにデプロイ

1. [Vercel](https://vercel.com/) にログイン
2. 「New Project」をクリック
3. GitHub/GitLab/Bitbucketからリポジトリをインポート
4. プロジェクト設定：
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: 環境変数を設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Xサーバー SMTP
SMTP_HOST=smtp.xserver.jp
SMTP_PORT=587
SMTP_USER=yoyaku@colors092.site
SMTP_PASSWORD=your_email_password

# Stripe（本番環境）
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Zoom API（オプション）
ZOOM_ACCOUNT_ID=xxxxxxxxxxxxx
ZOOM_CLIENT_ID=xxxxxxxxxxxxx
ZOOM_CLIENT_SECRET=xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
ADMIN_PASSWORD=your_secure_password
```

**重要**: 
- Production, Preview, Development のすべての環境に設定するか、必要に応じて選択
- `SUPABASE_SERVICE_ROLE_KEY` と `STRIPE_SECRET_KEY` は **機密情報** のため、慎重に取り扱い

### Step 4: デプロイ実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（2-5分）
3. デプロイURL（例: `https://your-project.vercel.app`）でサイトにアクセス

### Step 5: ドメイン設定（独自ドメインを使う場合）

1. Vercelダッシュボード → 「Settings」→「Domains」
2. ドメインを追加
3. DNS設定をVercelの指示に従って設定
4. SSL証明書は自動発行されます（数分〜数時間）

---

## ✅ デプロイ後の確認事項

### 1. 基本動作確認

- [ ] トップページが表示される
- [ ] 予約カレンダーが表示される
- [ ] 予約フォームが動作する
- [ ] 管理画面にログインできる（`/admin/login`）

### 2. Supabase接続確認

- [ ] Supabaseダッシュボードで本番環境のデータが正しく保存されているか確認
- [ ] Storageバケットに画像がアップロードできるか確認

### 3. メール送信確認

- [ ] 予約確定メールが送信されるか確認
- [ ] 管理者への通知メールが `yoyaku@colors092.site` に届くか確認

### 4. Stripe決済確認

- [ ] Stripeテストモードで決済が動作するか確認
- [ ] Webhookが正しく動作するか確認（Stripeダッシュボードで確認）

### 5. スケジュールデータ作成

```bash
# 本番環境で実行する場合
# Vercelの「Settings」→「Environment Variables」で環境変数を設定後、
# ローカルで実行（環境変数を本番用に変更）:

# .env.local を本番環境用に更新
npm run seed
```

または、SupabaseダッシュボードのSQL Editorから直接データを作成

---

## 🔐 セキュリティチェックリスト

- [ ] すべての環境変数が正しく設定されている
- [ ] `SUPABASE_SERVICE_ROLE_KEY` と `STRIPE_SECRET_KEY` が本番環境で設定されている
- [ ] 管理画面パスワードが強力なパスワードになっている
- [ ] `.env.local` ファイルがGitにコミットされていない（`.gitignore`で除外されている）
- [ ] StripeのWebhookシークレットが正しく設定されている
- [ ] 本番環境のURLが `NEXT_PUBLIC_APP_URL` に正しく設定されている

---

## 📝 本番環境用のチェックリスト

### 準備が必要な情報

#### Supabase
- [ ] 本番環境のSupabaseプロジェクトを作成（または既存を使用）
- [ ] データベーススキーマを適用
- [ ] Storageバケットを作成
- [ ] 3つのAPIキーを取得

#### Stripe
- [ ] Stripeアカウントを作成
- [ ] 本番環境のAPIキー（2つ）を取得
- [ ] Webhookエンドポイントを設定
- [ ] Webhookシークレットを取得

#### Zoom API（オプション）
- [ ] Zoom Developerアカウントを作成
- [ ] Server-to-Server OAuthアプリを作成
- [ ] 3つの認証情報を取得

#### ドメイン・ホスティング
- [ ] ドメインを取得（オプション、Vercelの無料ドメインも使える）
- [ ] Vercelアカウントを作成
- [ ] 本番環境のURLを決定

#### その他
- [ ] 管理画面パスワードを決定
- [ ] メールパスワードを確認（Xサーバーで設定済み）

---

## 🆘 トラブルシューティング

### ビルドエラー

- `npm run build` をローカルで実行してエラーを確認
- TypeScriptの型エラーを修正
- 環境変数が正しく設定されているか確認

### 環境変数が反映されない

- Vercelの環境変数を再設定
- デプロイを再実行
- ブラウザのキャッシュをクリア

### メールが送信されない

- SMTP設定が正しいか確認
- Xサーバーのメールパスワードが正しいか確認
- Vercelのログでエラーを確認

### Stripe決済が動作しない

- 本番環境のAPIキーを使用しているか確認（`sk_live_` と `pk_live_`）
- Webhookエンドポイントが正しく設定されているか確認
- Stripeダッシュボードでエラーを確認

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：
- Vercelのデプロイログ
- Supabaseのログ
- StripeのWebhookログ
- ブラウザのコンソールエラー

---

**次のステップ**: 上記のチェックリストに従って、必要な情報を準備し、Vercelにデプロイしてください。

