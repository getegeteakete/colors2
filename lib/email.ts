import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.SMTP_USER || 's@colors092.site';
const FROM_NAME = '株式会社COLORS';
const ADMIN_EMAIL = process.env.SMTP_USER || 's@colors092.site';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://colors-yoyaku.vercel.app';

// ── 共通HTMLテンプレート ──────────────────────────
const baseStyle = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f4f6f9; font-family: 'Noto Sans JP', 'Hiragino Sans', Meiryo, sans-serif; color: #333; }
    .wrapper { max-width: 620px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a3561 0%, #2856a3 100%); padding: 36px 40px; text-align: center; }
    .header-logo { color: #fff; font-size: 22px; font-weight: 700; letter-spacing: 2px; margin-bottom: 4px; }
    .header-sub { color: rgba(255,255,255,0.75); font-size: 12px; letter-spacing: 1px; }
    .header-title { color: #fff; font-size: 18px; font-weight: 700; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); }
    .body { padding: 36px 40px; }
    .greeting { font-size: 15px; color: #444; margin-bottom: 16px; line-height: 1.8; }
    .info-card { background: #f8faff; border: 1px solid #dde6f5; border-radius: 8px; padding: 24px; margin: 24px 0; }
    .info-card h3 { font-size: 13px; font-weight: 700; color: #2856a3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #dde6f5; }
    .info-row { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eef2f8; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #6b7a9a; min-width: 120px; font-weight: 500; }
    .info-value { color: #1a2a4a; font-weight: 400; flex: 1; }
    .highlight-box { background: linear-gradient(135deg, #e8f0fe 0%, #d4e3ff 100%); border-left: 4px solid #2856a3; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 20px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #1a3561 0%, #2856a3 100%); color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 8px 4px; }
    .btn-zoom { background: linear-gradient(135deg, #2D8CFF 0%, #1a6fd8 100%); }
    .btn-outline { background: #fff; color: #2856a3 !important; border: 2px solid #2856a3; }
    .note { background: #fffbf0; border: 1px solid #ffe4a0; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #7a5a00; margin: 20px 0; line-height: 1.7; }
    .divider { height: 1px; background: #eef2f8; margin: 24px 0; }
    .message-text { font-size: 14px; color: #444; line-height: 1.9; margin: 12px 0; }
    .footer { background: #1a2a4a; padding: 28px 40px; text-align: center; }
    .footer-name { color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
    .footer-info { color: rgba(255,255,255,0.6); font-size: 12px; line-height: 1.8; }
    .footer-info a { color: rgba(255,255,255,0.8); text-decoration: none; }
    .status-badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; }
    .admin-header { background: linear-gradient(135deg, #b71c1c 0%, #e53935 100%); }
  </style>
`;

const footer = `
  <div class="footer">
    <div class="footer-name">株式会社COLORS</div>
    <div class="footer-info">
      📞 090-6120-2995（月〜金 9:00〜17:00）<br>
      ✉️ <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a><br>
      🌐 福岡市を中心にご対応いたします
    </div>
  </div>
`;

// ── 型定義 ────────────────────────────────────────
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

// ── 1. 予約確認メール（お客様宛）────────────────────
export async function sendReservationConfirmationEmail(data: ReservationEmailData) {
  const { name, email, date, time, type, address, content, zoomUrl } = data;
  const typeLabel = type === 'onsite' ? '訪問調査' : 'Zoom相談';

  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">${baseStyle}</head><body>
    <div class="wrapper">
      <div class="header">
        <div class="header-logo">COLORS</div>
        <div class="header-sub">PAINTING &amp; REFORM</div>
        <div class="header-title">予約確認のご案内</div>
      </div>
      <div class="body">
        <p class="greeting">${name} 様<br><br>この度は株式会社COLORSにご予約いただき、誠にありがとうございます。<br>以下の内容でご予約を承りました。</p>
        <div class="info-card">
          <h3>📋 ご予約内容</h3>
          <div class="info-row"><span class="info-label">日時</span><span class="info-value"><strong>${date} ${time}</strong></span></div>
          <div class="info-row"><span class="info-label">種類</span><span class="info-value">${typeLabel}</span></div>
          ${address ? `<div class="info-row"><span class="info-label">調査先住所</span><span class="info-value">${address}</span></div>` : ''}
          ${zoomUrl ? `<div class="info-row"><span class="info-label">Zoom URL</span><span class="info-value"><a href="${zoomUrl}" style="color:#2856a3;">${zoomUrl}</a></span></div>` : ''}
          <div class="info-row"><span class="info-label">相談内容</span><span class="info-value">${content.replace(/\n/g, '<br>')}</span></div>
        </div>
        ${type === 'zoom' && zoomUrl ? `
        <div style="text-align:center; margin: 24px 0;">
          <a href="${zoomUrl}" class="btn btn-zoom">🎥 Zoomに参加する</a>
        </div>` : ''}
        <div class="highlight-box">
          ${type === 'onsite'
            ? '📍 スタッフが指定の日時にご自宅へ訪問いたします。当日は作業の妨げにならない服装でお待ちください。'
            : '💻 Zoom相談の当日は、上記URLから入室をお願いします。お時間の5分前にはご準備ください。'
          }
        </div>
        <div class="note">⚠️ ご都合が悪くなった場合は、お早めに下記までご連絡ください。</div>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${APP_URL}/mypage" class="btn btn-outline">マイページで予約を確認</a>
        </div>
        <p class="message-text">ご不明な点がございましたら、お気軽にお問い合わせください。<br>引き続き、株式会社COLORSをよろしくお願いいたします。</p>
      </div>
      ${footer}
    </div>
  </body></html>`;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    bcc: [ADMIN_EMAIL],
    replyTo: ADMIN_EMAIL,
    subject: `【予約確認】${date} ${time} ${typeLabel}のご予約を承りました`,
    html,
  });
  if (error) throw error;
  return { success: true, messageId: result?.id };
}

// ── 2. 顧客登録完了メール ────────────────────────
export async function sendWelcomeEmail(name: string, email: string) {
  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">${baseStyle}</head><body>
    <div class="wrapper">
      <div class="header">
        <div class="header-logo">COLORS</div>
        <div class="header-sub">PAINTING &amp; REFORM</div>
        <div class="header-title">ご登録ありがとうございます</div>
      </div>
      <div class="body">
        <p class="greeting">${name} 様<br><br>株式会社COLORSの予約サービスにご登録いただき、誠にありがとうございます。<br>マイページからいつでも予約履歴・支払い履歴をご確認いただけます。</p>
        <div class="info-card">
          <h3>✅ ご登録内容</h3>
          <div class="info-row"><span class="info-label">お名前</span><span class="info-value">${name} 様</span></div>
          <div class="info-row"><span class="info-label">メールアドレス</span><span class="info-value">${email}</span></div>
        </div>
        <div class="highlight-box">
          🔐 初回マイページログイン時にパスワードを設定してください。設定後は安全にご利用いただけます。
        </div>
        <div style="text-align:center; margin: 28px 0;">
          <a href="${APP_URL}/mypage" class="btn">マイページにログインする</a>
        </div>
        <div class="divider"></div>
        <p class="message-text">COLORSでは塗装・リフォームのプロとして、お客様のご自宅を美しく保つお手伝いをいたします。お気軽にご相談ください。</p>
      </div>
      ${footer}
    </div>
  </body></html>`;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    replyTo: ADMIN_EMAIL,
    subject: '【COLORS】ご登録ありがとうございます',
    html,
  });
  if (error) throw error;
  return { success: true, messageId: result?.id };
}

// ── 3. Zoomリマインドメール ───────────────────────
export async function sendZoomReminderEmail(data: ReservationEmailData) {
  const { name, email, date, time, zoomUrl } = data;

  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">${baseStyle}</head><body>
    <div class="wrapper">
      <div class="header">
        <div class="header-logo">COLORS</div>
        <div class="header-sub">PAINTING &amp; REFORM</div>
        <div class="header-title">明日のZoom相談リマインド</div>
      </div>
      <div class="body">
        <p class="greeting">${name} 様<br><br>明日のZoom相談のお時間が近づいてまいりました。<br>以下の内容をご確認のうえ、お時間になりましたらご参加ください。</p>
        <div class="info-card">
          <h3>📅 ご予約内容</h3>
          <div class="info-row"><span class="info-label">日時</span><span class="info-value"><strong>${date} ${time}</strong></span></div>
          <div class="info-row"><span class="info-label">種類</span><span class="info-value">Zoom相談</span></div>
          ${zoomUrl ? `<div class="info-row"><span class="info-label">Zoom URL</span><span class="info-value"><a href="${zoomUrl}" style="color:#2856a3;">${zoomUrl}</a></span></div>` : ''}
        </div>
        ${zoomUrl ? `
        <div style="text-align:center; margin: 28px 0;">
          <a href="${zoomUrl}" class="btn btn-zoom">🎥 Zoomを開く</a>
        </div>` : ''}
        <div class="highlight-box">
          ⏰ お時間の <strong>5分前</strong> には入室の準備をお願いいたします。<br>
          カメラ・マイクの動作確認をあらかじめお願いします。
        </div>
        <div class="note">ご都合が悪くなった場合は、お早めにご連絡ください。</div>
      </div>
      ${footer}
    </div>
  </body></html>`;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    replyTo: ADMIN_EMAIL,
    subject: `【リマインド】明日 ${time} からZoom相談があります`,
    html,
  });
  if (error) throw error;
  return { success: true, messageId: result?.id };
}

// ── 4. 管理者通知メール ──────────────────────────
export async function sendAdminNotificationEmail(data: ReservationEmailData) {
  const { name, email, date, time, type, address, content, zoomUrl } = data;
  const typeLabel = type === 'onsite' ? '訪問調査' : 'Zoom相談';

  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">${baseStyle}</head><body>
    <div class="wrapper">
      <div class="header admin-header">
        <div class="header-logo">COLORS 管理</div>
        <div class="header-sub">ADMIN NOTIFICATION</div>
        <div class="header-title">🔔 新規予約が入りました</div>
      </div>
      <div class="body">
        <p class="greeting">新しい予約が入りました。内容をご確認ください。</p>
        <div class="info-card">
          <h3>👤 お客様情報</h3>
          <div class="info-row"><span class="info-label">お名前</span><span class="info-value"><strong>${name} 様</strong></span></div>
          <div class="info-row"><span class="info-label">メール</span><span class="info-value"><a href="mailto:${email}" style="color:#2856a3;">${email}</a></span></div>
        </div>
        <div class="info-card">
          <h3>📋 予約内容</h3>
          <div class="info-row"><span class="info-label">日時</span><span class="info-value"><strong>${date} ${time}</strong></span></div>
          <div class="info-row"><span class="info-label">種類</span><span class="info-value">${typeLabel}</span></div>
          ${address ? `<div class="info-row"><span class="info-label">住所</span><span class="info-value">${address}</span></div>` : ''}
          ${zoomUrl ? `<div class="info-row"><span class="info-label">Zoom URL</span><span class="info-value"><a href="${zoomUrl}" style="color:#2856a3;">${zoomUrl}</a></span></div>` : ''}
          <div class="info-row"><span class="info-label">相談内容</span><span class="info-value">${content.replace(/\n/g, '<br>')}</span></div>
        </div>
        <div style="text-align:center; margin: 24px 0;">
          <a href="${APP_URL}/admin/reservations" class="btn">管理画面で確認する</a>
        </div>
      </div>
      ${footer}
    </div>
  </body></html>`;

  const { data: result, error } = await resend.emails.send({
    from: `予約システム <${FROM_EMAIL}>`,
    to: [ADMIN_EMAIL],
    subject: `【新規予約】${name}様 - ${date} ${time} ${typeLabel}`,
    html,
  });
  if (error) throw error;
  return { success: true, messageId: result?.id };
}

// ── 5. パスワード設定案内メール ──────────────────
export async function sendPasswordSetupEmail(name: string, email: string) {
  const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">${baseStyle}</head><body>
    <div class="wrapper">
      <div class="header">
        <div class="header-logo">COLORS</div>
        <div class="header-sub">PAINTING &amp; REFORM</div>
        <div class="header-title">🔐 マイページのご案内</div>
      </div>
      <div class="body">
        <p class="greeting">${name} 様<br><br>ご予約ありがとうございます。<br>マイページから予約履歴・支払い履歴・請求書のダウンロードができます。</p>
        <div class="highlight-box">
          初めてマイページにアクセスする際に<strong>パスワードを設定</strong>してください。<br>
          メールアドレスを入力するだけで簡単に設定できます。
        </div>
        <div style="text-align:center; margin: 28px 0;">
          <a href="${APP_URL}/mypage" class="btn">マイページを開く</a>
        </div>
        <div class="info-card">
          <h3>📱 マイページでできること</h3>
          <div class="info-row"><span class="info-label">予約履歴</span><span class="info-value">過去・現在の予約を確認</span></div>
          <div class="info-row"><span class="info-label">支払い履歴</span><span class="info-value">お支払い状況を確認</span></div>
          <div class="info-row"><span class="info-label">請求書</span><span class="info-value">PDFでダウンロード</span></div>
          <div class="info-row"><span class="info-label">領収書</span><span class="info-value">支払完了後に発行</span></div>
        </div>
      </div>
      ${footer}
    </div>
  </body></html>`;

  const { data: result, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    replyTo: ADMIN_EMAIL,
    subject: '【COLORS】マイページのご案内',
    html,
  });
  if (error) throw error;
  return { success: true, messageId: result?.id };
}
