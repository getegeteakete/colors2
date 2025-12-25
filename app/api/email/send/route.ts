import { NextRequest, NextResponse } from 'next/server';
import { sendReservationConfirmationEmail, sendAdminNotificationEmail, ReservationEmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data: ReservationEmailData = await request.json();

    // バリデーション
    if (!data.name || !data.email || !data.date || !data.time) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // お客様への確認メール送信
    const customerResult = await sendReservationConfirmationEmail(data);

    // 管理者への通知メール送信
    let adminResult = null;
    try {
      adminResult = await sendAdminNotificationEmail(data);
    } catch (error) {
      console.error('管理者通知メール送信エラー（続行）:', error);
      // 管理者通知のエラーは続行
    }

    return NextResponse.json({
      success: true,
      customer: customerResult,
      admin: adminResult,
    });
  } catch (error: any) {
    console.error('メール送信エラー:', error);
    return NextResponse.json(
      { error: 'メール送信に失敗しました: ' + error.message },
      { status: 500 }
    );
  }
}
