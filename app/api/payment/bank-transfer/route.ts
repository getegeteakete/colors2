import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { payment_id } = await request.json();

    const supabase = await createServerClient();
    
    // 決済情報を取得
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, reservations(*, users(*))')
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: '決済情報が見つかりません' }, { status: 404 });
    }

    // 銀行振り込み情報（環境変数から取得、またはデータベースに保存）
    const bankInfo = {
      bank_name: process.env.BANK_NAME || '〇〇銀行',
      bank_branch: process.env.BANK_BRANCH || '〇〇支店',
      account_type: process.env.BANK_ACCOUNT_TYPE || '普通',
      account_number: process.env.BANK_ACCOUNT_NUMBER || '1234567',
      account_name: process.env.BANK_ACCOUNT_NAME || '株式会社COLORS',
    };

    // 振込参考番号を生成（予約IDから）
    const transferReference = `COL${payment.reservation_id.slice(0, 8).toUpperCase()}`;

    // 決済レコードを更新
    await supabase
      .from('payments')
      .update({
        bank_account_name: bankInfo.account_name,
        bank_account_number: bankInfo.account_number,
        bank_name: bankInfo.bank_name,
        bank_branch: bankInfo.bank_branch,
        transfer_reference: transferReference,
      })
      .eq('id', payment_id);

    return NextResponse.json({
      bank_info: bankInfo,
      transfer_reference: transferReference,
      amount: payment.amount,
      payment_id: payment_id,
    });
  } catch (error) {
    console.error('Error getting bank transfer info:', error);
    return NextResponse.json(
      { error: '銀行振り込み情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

