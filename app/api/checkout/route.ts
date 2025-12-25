import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { reservation_id, payment_method } = await request.json();

    const supabase = await createServerClient();
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*, users(*)')
      .eq('id', reservation_id)
      .single();

    if (reservationError || !reservation) {
      return NextResponse.json({ error: '予約が見つかりません' }, { status: 404 });
    }

    const amount = reservation.ai_price || 10000;

    const selectedPaymentMethod = payment_method || 'card';

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id,
        amount,
        status: 'pending',
        payment_method: selectedPaymentMethod,
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json({ error: '決済レコードの作成に失敗しました' }, { status: 500 });
    }

    // 銀行振り込みの場合
    if (selectedPaymentMethod === 'bank_transfer') {
      return NextResponse.json({
        payment_id: payment.id,
        payment_method: 'bank_transfer',
        message: '銀行振り込み情報を表示します',
      });
    }

    // PayPal決済の場合
    if (selectedPaymentMethod === 'paypal') {
      // PayPal決済の処理（後で実装）
      // 現在はStripe経由でPayPalも処理可能
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: `現地調査予約 - ${reservation.type === 'onsite' ? '訪問調査' : 'Zoom相談'}`,
                description: `${reservation.date} ${reservation.time}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserve/success?session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserve/checkout?reservation_id=${reservation_id}`,
        metadata: {
          reservation_id,
          payment_id: payment.id,
        },
      });

      await supabase
        .from('payments')
        .update({ stripe_intent: session.id })
        .eq('id', payment.id);

      return NextResponse.json({ sessionId: session.id, payment_method: 'paypal' });
    }

    // クレジットカード決済（Stripe）の場合
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `現地調査予約 - ${reservation.type === 'onsite' ? '訪問調査' : 'Zoom相談'}`,
              description: `${reservation.date} ${reservation.time}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserve/success?session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserve/checkout?reservation_id=${reservation_id}`,
      metadata: {
        reservation_id,
        payment_id: payment.id,
      },
    });

    // Update payment with stripe intent
    await supabase
      .from('payments')
      .update({ stripe_intent: session.id })
      .eq('id', payment.id);

    return NextResponse.json({ sessionId: session.id, payment_method: 'card' });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: '決済セッションの作成に失敗しました' }, { status: 500 });
  }
}








