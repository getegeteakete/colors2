import Stripe from 'stripe';

// ビルド時には環境変数が設定されていない可能性があるため、
// 実行時にのみStripeクライアントを初期化する
const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia',
    })
  : // ビルド時の型エラーを回避するため、ダミーのインスタンスを作成
    (new Stripe('sk_test_dummy_key_for_build_time_only', {
      apiVersion: '2025-02-24.acacia',
    }) as Stripe);









