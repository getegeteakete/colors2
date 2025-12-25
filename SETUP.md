# 予約機能のセットアップガイド

このガイドでは、予約機能を動作させるための手順を説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- npm または yarn がインストールされていること

## ステップ1: Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスしてアカウントを作成（無料プランでOK）
2. 「New Project」をクリック
3. プロジェクト名とデータベースパスワードを設定
4. リージョンは「Northeast Asia (Tokyo)」を推奨
5. プロジェクトが作成されるまで待機（2-3分）

## ステップ2: データベーステーブルの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/migrations/001_initial_schema.sql` の内容をコピー
4. SQL Editorに貼り付けて「Run」をクリック
5. 「Success. No rows returned」と表示されれば成功

## ステップ3: Storageバケットの作成

### photosバケット

1. ダッシュボードで「Storage」を開く
2. 「Create a new bucket」をクリック
3. バケット名: `photos`
4. 「Public bucket」にチェックを入れる
5. 「Create bucket」をクリック

### ポリシーの設定

1. `photos` バケットを開く
2. 「Policies」タブを開く
3. 「New Policy」→「For full customization」を選択
4. ポリシー名: `Allow public read and insert`
5. 以下のSQLを入力：

```sql
-- SELECT ポリシー（読み取り）
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- INSERT ポリシー（アップロード）
CREATE POLICY "Allow public insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');
```

6. 「Review」→「Save policy」をクリック

## ステップ4: 環境変数の設定

1. プロジェクトルートに `.env.local` ファイルを作成
2. Supabaseダッシュボードの「Settings」→「API」から以下を取得：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`（⚠️ 秘密にしてください）

3. `.env.local` に以下を記入：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Xサーバー SMTP（メール送信）
SMTP_HOST=smtp.xserver.jp
SMTP_PORT=587
SMTP_USER=yoyaku@colors092.site
SMTP_PASSWORD=your_email_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:7000
```

**メール設定について:**
- Xサーバーのメールアドレス `yoyaku@colors092.site` を使用
- Xサーバーのサーバーパネルでメールパスワードを設定
- すべてのメールは `yoyaku@colors092.site` から送信
- 管理者への通知も `yoyaku@colors092.site` に届きます

## ステップ5: サンプルスケジュールデータの作成

```bash
npm run seed
```

このコマンドで、今日から60日分の営業日（火・水・木、11:00-18:00）のスケジュールが作成されます。

**注意**: 予約が確定すると、予約した時間とその前後1時間（移動時間のため）が自動的に予約不可になります。

**注意**: 環境変数 `SUPABASE_SERVICE_ROLE_KEY` が設定されている必要があります。

## ステップ6: 動作確認

1. 開発サーバーを起動：

```bash
npm run dev
```

2. ブラウザで http://localhost:7000 にアクセス
3. 「予約する」ボタンをクリック
4. カレンダーに日付が表示され、時間枠を選択できることを確認

## トラブルシューティング

### カレンダーに日付が表示されない

- `npm run seed` を実行してスケジュールデータが作成されているか確認
- Supabaseダッシュボードの「Table Editor」で `schedules` テーブルにデータがあるか確認

### エラー: "relation does not exist"

- データベーステーブルが正しく作成されているか確認
- `supabase/migrations/001_initial_schema.sql` を再実行

### エラー: "JWT expired" または認証エラー

- `.env.local` の環境変数が正しく設定されているか確認
- Supabaseダッシュボードから最新のキーを取得

### 写真がアップロードできない

- Storageバケット `photos` が作成されているか確認
- バケットのポリシーが正しく設定されているか確認

## 次のステップ

- Stripe決済機能を有効にする（オプション）
- Zoom API連携を設定する（オプション）
- 管理画面でスケジュールを管理する
