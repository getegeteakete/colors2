import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateInvoicePDF, generateReceiptPDF } from '@/lib/pdf';

export async function POST(request: NextRequest) {
  try {
    const { payment_id, type, email } = await request.json();

    if (!payment_id || !type || !email) {
      return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // ユーザー確認（本人のみDL可）
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    // 支払い情報取得
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*, reservations(*, users(*))')
      .eq('id', payment_id)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: '支払い情報が見つかりません' }, { status: 404 });
    }

    // 本人確認
    if (payment.reservations?.users?.id !== user.id) {
      return NextResponse.json({ error: 'アクセス権限がありません' }, { status: 403 });
    }

    const customerName = payment.reservations?.users?.name || 'お客様';
    const customerAddress = payment.reservations?.users?.address || null;
    const date = `${payment.reservations?.date} ${payment.reservations?.time}`;
    const amount = Number(payment.amount);

    let pdfUrl: string;

    if (type === 'invoice') {
      // キャッシュチェック
      if (payment.invoice_pdf_url) {
        return NextResponse.json({ url: payment.invoice_pdf_url });
      }
      pdfUrl = await generateInvoicePDF(payment_id, payment.reservation_id, amount, customerName, customerAddress, date);
      await supabase.from('payments').update({ invoice_pdf_url: pdfUrl }).eq('id', payment_id);
    } else if (type === 'receipt') {
      if (payment.receipt_pdf_url) {
        return NextResponse.json({ url: payment.receipt_pdf_url });
      }
      if (payment.status !== 'paid') {
        return NextResponse.json({ error: '支払い完了後に領収書を発行できます' }, { status: 400 });
      }
      pdfUrl = await generateReceiptPDF(payment_id, payment.reservation_id, amount, customerName, date);
      await supabase.from('payments').update({ receipt_pdf_url: pdfUrl }).eq('id', payment_id);
    } else {
      return NextResponse.json({ error: '不正なタイプです' }, { status: 400 });
    }

    return NextResponse.json({ url: pdfUrl });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF生成に失敗しました: ' + error.message }, { status: 500 });
  }
}
