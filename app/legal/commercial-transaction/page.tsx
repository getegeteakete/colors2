import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function CommercialTransactionPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップページに戻る
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center">
            特定商取引法に基づく表記
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">事業者</h2>
            <dl className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-3 gap-x-4">
              <dt className="font-semibold text-muted-foreground">事業者名</dt>
              <dd>株式会社COLORS</dd>

              <dt className="font-semibold text-muted-foreground">代表者</dt>
              <dd>竹原 悟史</dd>

              <dt className="font-semibold text-muted-foreground">所在地</dt>
              <dd>
                〒811-0202<br />
                福岡県福岡市東区和白1丁目1番35号
              </dd>

              <dt className="font-semibold text-muted-foreground">電話番号</dt>
              <dd>
                <a
                  href="tel:09061202995"
                  className="text-primary hover:underline"
                >
                  090-6120-2995
                </a>
              </dd>

              <dt className="font-semibold text-muted-foreground">メールアドレス</dt>
              <dd>
                <a
                  href="mailto:yoyaku@colors092.site"
                  className="text-primary hover:underline"
                >
                  yoyaku@colors092.site
                </a>
              </dd>
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">販売価格</h2>
            <p className="text-muted-foreground">
              各サービスの料金は、現地調査時に提示する見積書に記載された金額となります。
              予約時には現地調査の予約金として指定された金額をお支払いいただき、
              作業完了後、残金をお支払いいただく形となります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">支払方法</h2>
            <p className="text-muted-foreground mb-2">
              クレジットカード決済（Stripe決済システムを使用）
            </p>
            <p className="text-sm text-muted-foreground">
              対応カード: VISA、Mastercard、American Express、JCBなど
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">支払時期</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong className="text-foreground">予約金:</strong>{' '}
                  現地調査の予約確定時にお支払いいただきます。
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong className="text-foreground">残金:</strong>{' '}
                  作業完了後、指定された期日までにお支払いいただきます。
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">サービス提供時期</h2>
            <p className="text-muted-foreground">
              予約時に選択いただいた日時に、現地調査を実施いたします。
              調査後、見積書をご提示し、ご承認いただいた後、作業日程を調整いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">キャンセル・返金について</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">現地調査のキャンセル</h3>
                <ul className="space-y-1 ml-4">
                  <li>• 予約日の3営業日前まで: 全額返金いたします</li>
                  <li>• 予約日の2営業日前から前日まで: 予約金の50%を返金いたします</li>
                  <li>• 予約日当日: 返金はいたしません</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">作業のキャンセル</h3>
                <p>
                  作業開始後のキャンセルについては、実施した作業分の費用を差し引いた金額を返金いたします。
                  詳細につきましては、個別にご相談ください。
                </p>
              </div>
              <div>
                <p className="text-sm">
                  ※ 返金処理には、お客様の指定口座への振込手数料が発生する場合がございます。
                  返金手続きについては、お電話またはメールにてご連絡ください。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">返品・交換について</h2>
            <p className="text-muted-foreground">
              当サービスは塗装・リフォームの現地調査および施工サービスを提供するものであり、
              物理的な商品の販売ではございません。そのため、返品・交換の対象外となります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">サービス内容</h2>
            <p className="text-muted-foreground mb-2">
              塗装・リフォームの現地調査予約サービス
            </p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• 住宅の外壁や内装の塗装</li>
              <li>• 施設の外装・内装塗装（商業施設・オフィスビルなど）</li>
              <li>• 車体塗装</li>
              <li>• キッチンやバスルームのリフォーム</li>
              <li>• 間取りの変更</li>
              <li>• 収納の増設</li>
              <li>• その他住宅リフォーム全般</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">営業時間</h2>
            <p className="text-muted-foreground">
              現地調査の予約受付: 火曜日、水曜日、木曜日 11:00〜18:00
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ※ インターネット上での予約は24時間受け付けております。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">その他</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                当社は、お客様の個人情報を適切に管理し、サービスの提供に必要な範囲でのみ使用いたします。
                個人情報の取り扱いについては、別途定めるプライバシーポリシーに従います。
              </p>
              <p>
                サービスに関するお問い合わせは、上記の電話番号またはメールアドレスまでご連絡ください。
              </p>
            </div>
          </section>

          <div className="pt-6 border-t text-center">
            <Link href="/">
              <Button>トップページに戻る</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
