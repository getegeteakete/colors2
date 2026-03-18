import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendPasswordSetupEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // ウェルカムメール送信
    await sendWelcomeEmail(name, email);

    // マイページ・パスワード設定案内メール送信
    await sendPasswordSetupEmail(name, email);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('ウェルカムメール送信エラー:', error);
    return NextResponse.json(
      { error: 'ウェルカムメール送信に失敗しました: ' + error.message },
      { status: 500 }
    );
  }
}
