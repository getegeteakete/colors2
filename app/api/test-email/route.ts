import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY が設定されていません' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['sup@ei-life.co.jp'],
      subject: '【テスト】Resendメール送信テスト - COLORS予約システム',
      html: '<p>Resendからのテストメールです。このメールが届けば設定完了です！</p>',
    });

    if (error) {
      return NextResponse.json({ error: error.message, detail: error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id, apiKeyPrefix: apiKey.slice(0, 8) + '...' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
