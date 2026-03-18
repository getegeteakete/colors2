import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev';
const FROM_NAME = '株式会社COLORS';
const ADMIN_EMAIL = process.env.SMTP_USER || 's@colors092.site';

export interface ReservationEmailData {
  name: string;
  email: string;
  date: string;
  time: string;
  type: 'onsite' | 'zoom';
  address?: string;
  content: string;
  zoomUrl?: string;
}

// 予約確認メール（お客様宛）
export async function sendReservationConfirmationEmail(data: ReservationEmailData) {
  const { name, email, date, time, type, address, content, zoomUrl } = data;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    bcc: [ADMIN_EMAIL],
    reply_to: ADMIN_EMAIL,
    subject: '【予約確認】現地調査のご予約を承りました',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
          .info-box { background-color: white; border-left: 4px solid #1e3a5f; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 6px 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin:0;">予約確認</h1></div>
          <div class="content">
            <p>${name} 様</p>
            <p>この度は、株式会社COLORSの現地調査予約サービスをご利用いただき、誠にありがとうございます。<br>以下の内容でご予約を承りました。</p>
            <div class="info-box">
              <h3 style="margin-top:0;">予約内容</h3>
              <p><strong>日時：</strong>${date} ${time}</p>
              <p><strong>種類：</strong>${type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
              ${address ? `<p><strong>調査先住所：</strong>${address}</p>` : ''}
              ${zoomUrl ? `<p><strong>Zoom URL：</strong><a href="${zoomUrl}">${zoomUrl}</a></p>` : ''}
              <p><strong>相談内容：</strong><br>${content.replace(/\n/g, '<br>')}</p>
            </div>
            ${type === 'onsite'
              ? '<p>スタッフが指定の日時に現地へ訪問いたします。ご都合が悪くなった場合はお早めにご連絡ください。</p>'
              : '<p>Zoom相談の場合は、上記のZoom URLからアクセスしてください。お時間の5分前には準備をお願いいたします。</p>'
            }
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。<br>今後とも株式会社COLORSをよろしくお願いいたします。</p>
          </div>
          <div class="footer">
            <p><strong>株式会社COLORS</strong></p>
            <p>電話：090-6120-2995（月〜金 9:00〜17:00）</p>
            <p>メール：${ADMIN_EMAIL}</p>
            <p>福岡市を中心にご対応いたします。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) throw error;
  console.log('予約確認メール送信成功:', result?.id);
  return { success: true, messageId: result?.id };
}

// Zoomリマインドメール
export async function sendZoomReminderEmail(data: ReservationEmailData) {
  const { name, email, date, time, zoomUrl } = data;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    reply_to: ADMIN_EMAIL,
    subject: '【リマインド】明日のZoom相談のご案内',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
          .info-box { background-color: white; border-left: 4px solid #1e3a5f; padding: 15px; margin: 20px 0; }
          .zoom-btn { display: inline-block; background-color: #2D8CFF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 6px 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin:0;">Zoom相談リマインド</h1></div>
          <div class="content">
            <p>${name} 様</p>
            <p>明日のZoom相談のお時間が近づいてまいりましたので、リマインドのご案内をお送りします。</p>
            <div class="info-box">
              <h3 style="margin-top:0;">ご予約内容</h3>
              <p><strong>日時：</strong>${date} ${time}</p>
              ${zoomUrl ? `<p><strong>Zoom URL：</strong><a href="${zoomUrl}">${zoomUrl}</a></p>` : ''}
            </div>
            ${zoomUrl ? `<p style="text-align:center;"><a href="${zoomUrl}" class="zoom-btn">Zoomを開く</a></p>` : ''}
            <p>お時間の5分前には入室準備をお願いいたします。<br>ご都合が悪くなった場合は、お早めにご連絡ください。</p>
          </div>
          <div class="footer">
            <p><strong>株式会社COLORS</strong></p>
            <p>電話：090-6120-2995 ／ メール：${ADMIN_EMAIL}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) throw error;
  console.log('Zoomリマインドメール送信成功:', result?.id);
  return { success: true, messageId: result?.id };
}

// 管理者への通知メール
export async function sendAdminNotificationEmail(data: ReservationEmailData) {
  const { name, email, date, time, type, address, content, zoomUrl } = data;

  const { data: result, error } = await resend.emails.send({
    from: `予約システム <${FROM_EMAIL}>`,
    to: [ADMIN_EMAIL],
    subject: `【新規予約】${name}様 - ${date} ${time}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #c62828; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
          .info-box { background-color: white; border-left: 4px solid #c62828; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin:0;">新規予約通知</h1></div>
          <div class="content">
            <p>新しい予約が入りました。</p>
            <div class="info-box">
              <p><strong>お客様名：</strong>${name}</p>
              <p><strong>メール：</strong>${email}</p>
              <p><strong>日時：</strong>${date} ${time}</p>
              <p><strong>種類：</strong>${type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
              ${address ? `<p><strong>調査先住所：</strong>${address}</p>` : ''}
              ${zoomUrl ? `<p><strong>Zoom URL：</strong>${zoomUrl}</p>` : ''}
              <p><strong>相談内容：</strong><br>${content.replace(/\n/g, '<br>')}</p>
            </div>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/reservations" style="color:#c62828;">→ 管理画面で確認する</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) throw error;
  console.log('管理者通知メール送信成功:', result?.id);
  return { success: true, messageId: result?.id };
}
