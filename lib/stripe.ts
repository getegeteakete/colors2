import Stripe from 'stripe';

// 一時的にダミーキーで動作するように設定
// 本番環境では環境変数STRIPE_SECRET_KEYを設定してください
const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build_time_only';

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-02-24.acacia',
});









