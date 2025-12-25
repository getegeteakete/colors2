import nodemailer from 'nodemailer';

// XサーバーのSMTP設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.xserver.jp',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLSを使用
  auth: {
    user: process.env.SMTP_USER || 'yoyaku@colors092.site',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

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

  const adminEmail = process.env.SMTP_USER || 'yoyaku@colors092.site';
  
  const mailOptions = {
    from: `"株式会社COLORS" <${adminEmail}>`,
    to: email,
    bcc: adminEmail, // すべてのメールをyoyaku@colors092.siteでも受け取る
    replyTo: adminEmail,
    subject: '【予約確認】現地調査のご予約を承りました',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .info-box { background-color: white; border-left: 4px solid #1e3a5f; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; background-color: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>予約確認</h1>
          </div>
          <div class="content">
            <p>${name} 様</p>
            <p>この度は、株式会社COLORSの現地調査予約サービスをご利用いただき、誠にありがとうございます。</p>
            <p>以下の内容でご予約を承りました。</p>
            
            <div class="info-box">
              <h3>予約内容</h3>
              <p><strong>日時:</strong> ${date} ${time}</p>
              <p><strong>種類:</strong> ${type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
              ${address ? `<p><strong>調査先住所:</strong> ${address}</p>` : ''}
              ${zoomUrl ? `<p><strong>Zoom URL:</strong> <a href="${zoomUrl}">${zoomUrl}</a></p>` : ''}
              <p><strong>相談内容:</strong><br>${content.replace(/\n/g, '<br>')}</p>
            </div>

            ${type === 'onsite' ? `
            <p>スタッフが指定の日時に現地に訪問いたします。ご都合が悪くなった場合は、お早めにご連絡ください。</p>
            ` : `
            <p>Zoom相談の場合は、上記のZoom URLからアクセスしてください。</p>
            `}

            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
            
            <p>今後とも株式会社COLORSをよろしくお願いいたします。</p>
          </div>
          <div class="footer">
            <p>株式会社COLORS</p>
            <p>電話: 090-6120-2995（月〜金 9:00〜17:00）</p>
            <p>メール: ${process.env.SMTP_USER || 'yoyaku@colors092.site'}</p>
            <p>福岡市を中心にご対応いたします。</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
${name} 様

この度は、株式会社COLORSの現地調査予約サービスをご利用いただき、誠にありがとうございます。

以下の内容でご予約を承りました。

【予約内容】
日時: ${date} ${time}
種類: ${type === 'onsite' ? '訪問調査' : 'Zoom相談'}
${address ? `調査先住所: ${address}` : ''}
${zoomUrl ? `Zoom URL: ${zoomUrl}` : ''}
相談内容: ${content}

${type === 'onsite' ? 'スタッフが指定の日時に現地に訪問いたします。ご都合が悪くなった場合は、お早めにご連絡ください。' : 'Zoom相談の場合は、上記のZoom URLからアクセスしてください。'}

ご不明な点がございましたら、お気軽にお問い合わせください。

今後とも株式会社COLORSをよろしくお願いいたします。

---
株式会社COLORS
電話: 090-6120-2995（月〜金 9:00〜17:00）
メール: ${process.env.SMTP_USER || 'yoyaku@colors092.site'}
福岡市を中心にご対応いたします。
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('予約確認メール送信成功:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('予約確認メール送信エラー:', error);
    throw error;
  }
}

// 管理者への通知メール
export async function sendAdminNotificationEmail(data: ReservationEmailData) {
  const { name, email, date, time, type, address, content, zoomUrl } = data;
  const adminEmail = process.env.SMTP_USER || 'yoyaku@colors092.site';

  const mailOptions = {
    from: `"予約システム" <${adminEmail}>`,
    to: adminEmail,
    subject: `【新規予約】${name}様 - ${date} ${time}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .info-box { background-color: white; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>新規予約通知</h1>
          </div>
          <div class="content">
            <p>新しい予約が入りました。</p>
            
            <div class="info-box">
              <h3>予約内容</h3>
              <p><strong>お客様名:</strong> ${name}</p>
              <p><strong>メールアドレス:</strong> ${email}</p>
              <p><strong>日時:</strong> ${date} ${time}</p>
              <p><strong>種類:</strong> ${type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
              ${address ? `<p><strong>調査先住所:</strong> ${address}</p>` : ''}
              ${zoomUrl ? `<p><strong>Zoom URL:</strong> <a href="${zoomUrl}">${zoomUrl}</a></p>` : ''}
              <p><strong>相談内容:</strong><br>${content.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
新規予約通知

新しい予約が入りました。

【予約内容】
お客様名: ${name}
メールアドレス: ${email}
日時: ${date} ${time}
種類: ${type === 'onsite' ? '訪問調査' : 'Zoom相談'}
${address ? `調査先住所: ${address}` : ''}
${zoomUrl ? `Zoom URL: ${zoomUrl}` : ''}
相談内容: ${content}
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('管理者通知メール送信成功:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('管理者通知メール送信エラー:', error);
    throw error;
  }
}
