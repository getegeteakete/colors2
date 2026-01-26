import PDFDocument from 'pdfkit';
import { createClient } from '@supabase/supabase-js';

// ビルド時に環境変数が設定されていない場合でもビルドが通るようにダミー値を使用
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function generateInvoicePDF(
  paymentId: string,
  reservationId: string,
  amount: number,
  customerName: string,
  customerAddress: string | null,
  date: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const fileName = `invoices/${paymentId}.pdf`;

        const { error } = await supabaseAdmin.storage
          .from('documents')
          .upload(fileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (error) {
          reject(error);
          return;
        }

        const { data: urlData } = supabaseAdmin.storage
          .from('documents')
          .getPublicUrl(fileName);

        resolve(urlData.publicUrl);
      } catch (error) {
        reject(error);
      }
    });
    doc.on('error', reject);

    // Invoice content
    doc.fontSize(20).text('請求書', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`請求日: ${new Date().toLocaleDateString('ja-JP')}`);
    doc.text(`請求番号: ${paymentId}`);
    doc.moveDown();

    doc.text(`お客様名: ${customerName}`);
    if (customerAddress) {
      doc.text(`住所: ${customerAddress}`);
    }
    doc.moveDown();

    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    doc.moveDown();

    doc.text(`予約ID: ${reservationId}`);
    doc.text(`予約日時: ${date}`);
    doc.moveDown();

    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    doc.moveDown();

    doc.text(`合計金額: ¥${amount.toLocaleString()}`, { align: 'right' });
    doc.moveDown(2);

    doc.fontSize(10);
    doc.text('※この請求書は自動生成されたものです。', { align: 'center' });

    doc.end();
  });
}

export async function generateReceiptPDF(
  paymentId: string,
  reservationId: string,
  amount: number,
  customerName: string,
  date: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const fileName = `receipts/${paymentId}.pdf`;

        const { error } = await supabaseAdmin.storage
          .from('documents')
          .upload(fileName, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (error) {
          reject(error);
          return;
        }

        const { data: urlData } = supabaseAdmin.storage
          .from('documents')
          .getPublicUrl(fileName);

        resolve(urlData.publicUrl);
      } catch (error) {
        reject(error);
      }
    });
    doc.on('error', reject);

    // Receipt content
    doc.fontSize(20).text('領収書', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`発行日: ${new Date().toLocaleDateString('ja-JP')}`);
    doc.text(`領収書番号: ${paymentId}`);
    doc.moveDown();

    doc.text(`お客様名: ${customerName}`);
    doc.moveDown();

    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    doc.moveDown();

    doc.text(`予約ID: ${reservationId}`);
    doc.text(`予約日時: ${date}`);
    doc.moveDown();

    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    doc.moveDown();

    doc.text(`受領金額: ¥${amount.toLocaleString()}`, { align: 'right' });
    doc.text('（税込）', { align: 'right' });
    doc.moveDown(2);

    doc.fontSize(10);
    doc.text('※この領収書は自動生成されたものです。', { align: 'center' });

    doc.end();
  });
}

