# 現地調査予約サイト

Next.js 14 + Supabase + Stripe + Zoom API を使用したリフォーム・塗装の現地調査予約システム

## クイックスタート

予約機能をすぐに使いたい場合は、[SETUP.md](./SETUP.md) の詳細なセットアップガイドを参照してください。

### 最小限のセットアップ（予約機能のみ）

1. **Supabaseプロジェクトを作成**
   - [Supabase](https://supabase.com/) でアカウント作成
   - 新しいプロジェクトを作成

2. **データベースをセットアップ**
   - Supabaseダッシュボードの「SQL Editor」で `supabase/migrations/001_initial_schema.sql` を実行

3. **環境変数を設定**
   - `.env.local` を作成してSupabaseの認証情報とメール設定を追加
   - 詳細は「環境変数の設定」セクションを参照

4. **サンプルデータを作成**
   ```bash
   npm run seed
   ```

5. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - anon/public key
   - service_role key

### 3. データベースのセットアップ

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/migrations/001_initial_schema.sql` の内容をコピー＆ペースト
3. 「Run」をクリックしてテーブルを作成

### 4. Storage バケットの作成

Supabaseダッシュボードの「Storage」から以下を作成：

1. **photos** バケット
   - 公開バケットとして作成
   - ポリシー: `SELECT` と `INSERT` を許可

2. **documents** バケット（オプション）
   - 公開バケットとして作成
   - ポリシー: `SELECT` と `INSERT` を許可

### 5. 環境変数の設定

`.env.local` ファイルを作成し、`.env.example` を参考に環境変数を設定：

```bash
cp .env.example .env.local
```

`.env.local` を編集して、Supabaseの認証情報を入力：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Xサーバー SMTP（メール送信）
SMTP_HOST=smtp.xserver.jp
SMTP_PORT=587
SMTP_USER=yoyaku@colors092.site
SMTP_PASSWORD=your_email_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:7000

# 管理画面パスワード（オプション）
ADMIN_PASSWORD=your_admin_password

# OpenAI API（AI見積もり機能 - オプション）
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# 銀行振り込み情報（銀行振り込み決済を使う場合）
BANK_NAME=〇〇銀行
BANK_BRANCH=〇〇支店
BANK_ACCOUNT_TYPE=普通
BANK_ACCOUNT_NUMBER=1234567
BANK_ACCOUNT_NAME=株式会社COLORS
```

**メール設定について:**
- Xサーバーのメールアドレス `yoyaku@colors092.site` を使用してメール送信を行います
- Xサーバーのサーバーパネルでメールパスワードを設定してください
- すべてのメールは `yoyaku@colors092.site` から送信され、管理者への通知もこのアドレスに届きます

**注意**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### 6. サンプルスケジュールデータの作成

予約カレンダーに表示するためのサンプルスケジュールを作成：

```bash
npm run seed
```

このコマンドは、今日から60日分の営業日（火・水・木、11:00-18:00、1時間枠）のスケジュールを作成します。

**予約受付時間について:**
- 営業日: 火曜日、水曜日、木曜日のみ
- 営業時間: 11:00～18:00（1時間枠）
- 予約確定時: 予約した時間とその前後1時間（移動時間のため）が自動的に予約不可になります

### 7. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:7000 で起動します。

### 8. 動作確認

1. トップページ（http://localhost:7000）にアクセス
2. 「予約する」ボタンをクリック
3. カレンダーから日付を選択
4. 時間枠を選択して予約フォームに進む

## 機能

- 予約カレンダー（空き枠表示）
- 予約フォーム（訪問/Zoom選択、写真アップロード）
- Stripe決済
- Zoomミーティング自動生成
- PDF生成（請求書・領収書）
- マイページ（予約履歴・支払履歴）
- 管理画面（ダッシュボード、予約管理、決済管理、スケジュール管理）

## デプロイ

Vercel にデプロイする場合：

1. GitHub リポジトリにプッシュ
2. Vercel でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ
