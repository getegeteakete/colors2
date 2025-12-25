import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase/server';
import { createZoomMeeting } from '@/lib/zoom';
import { generateInvoicePDF, generateReceiptPDF } from '@/lib/pdf';
import { sendReservationConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const reservationId = session.metadata?.reservation_id;
    const paymentId = session.metadata?.payment_id;

    if (!reservationId || !paymentId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Update payment status
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'paid' })
      .eq('id', paymentId)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      return NextResponse.json({ error: 'Payment update failed' }, { status: 500 });
    }

    // Get reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*, users(*)')
      .eq('id', reservationId)
      .single();

    if (reservationError || !reservation) {
      console.error('Error fetching reservation:', reservationError);
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Create Zoom meeting if needed
    if (reservation.type === 'zoom' && !reservation.zoom_url) {
      try {
        const meetingDateTime = new Date(`${reservation.date}T${reservation.time}`);
        const zoomUrl = await createZoomMeeting(
          `現地調査相談 - ${reservation.users.name}`,
          meetingDateTime.toISOString()
        );

        await supabase
          .from('reservations')
          .update({ zoom_url: zoomUrl })
          .eq('id', reservationId);
      } catch (error) {
        console.error('Error creating Zoom meeting:', error);
      }
    }

    // Generate PDFs
    try {
      const invoiceUrl = await generateInvoicePDF(
        payment.id,
        reservation.id,
        payment.amount,
        reservation.users.name,
        reservation.users.address,
        `${reservation.date} ${reservation.time}`
      );

      const receiptUrl = await generateReceiptPDF(
        payment.id,
        reservation.id,
        payment.amount,
        reservation.users.name,
        `${reservation.date} ${reservation.time}`
      );

      await supabase
        .from('payments')
        .update({
          invoice_pdf_url: invoiceUrl,
          receipt_pdf_url: receiptUrl,
        })
        .eq('id', paymentId);
    } catch (error) {
      console.error('Error generating PDFs:', error);
    }

    // 決済完了メール送信
    try {
      await sendReservationConfirmationEmail({
        name: reservation.users.name,
        email: reservation.users.email,
        date: reservation.date,
        time: reservation.time,
        type: reservation.type as 'onsite' | 'zoom',
        address: reservation.address || undefined,
        content: reservation.content,
        zoomUrl: reservation.zoom_url || undefined,
      });
    } catch (error) {
      console.error('決済完了メール送信エラー（続行）:', error);
    }
  }

  return NextResponse.json({ received: true });
}








