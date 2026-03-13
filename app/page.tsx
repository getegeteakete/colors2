import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Home as HomeIcon, 
  Brush, 
  Wrench, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  MapPin,
  Building2
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/1.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-base px-4 py-2 bg-white/90 text-foreground border-0">
              <Calendar className="w-4 h-4 mr-2" />
              24時間いつでもオンライン予約可能
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight drop-shadow-md">
              リフォーム・塗装の<br />
              現地調査を<br className="md:hidden" />
              <span className="text-primary">簡単予約</span>
            </h1>
            <p className="text-lg md:text-xl text-white/95 mb-4 max-w-2xl mx-auto drop-shadow">
              株式会社COLORSのリフォーム・塗装現地調査予約サービス。<br />
              日程選択から決済まで、すべてオンラインで完結します。
            </p>
            <p className="text-base text-white/90 mb-8">
              <span className="font-semibold">福岡市を中心にご対応いたします。</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reserve">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  今すぐ予約する
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/flow">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  利用方法を見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              対応可能な業務内容
            </h2>
            <p className="text-lg text-muted-foreground">
              リフォームと塗装のプロフェッショナルが対応します
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden p-8 hover:shadow-lg transition-shadow min-h-[320px] bg-cover bg-center bg-no-repeat border-0" style={{ backgroundImage: "url('/tosou.png')" }}>
              <div className="absolute inset-0 bg-black/50" aria-hidden />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Brush className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4 text-white">塗装サービス</CardTitle>
                <CardDescription className="text-base mb-4 text-white/95">
                  住宅の外壁や内装の塗装から、施設・車体まで幅広く対応
                </CardDescription>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>住宅の外壁や内装の塗装</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>施設の外装・内装塗装（商業施設・オフィスビルなど）</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>車体塗装</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            <Card className="relative overflow-hidden p-8 hover:shadow-lg transition-shadow min-h-[320px] bg-cover bg-center bg-no-repeat border-0" style={{ backgroundImage: "url('/rifo.png')" }}>
              <div className="absolute inset-0 bg-black/50" aria-hidden />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4 text-white">リフォームサービス</CardTitle>
                <CardDescription className="text-base mb-4 text-white/95">
                  快適な住まいづくりをサポートする幅広いリフォームサービス
                </CardDescription>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>キッチンやバスルームのリフォーム</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>間取りの変更</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>収納の増設</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>その他住宅リフォーム全般</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ご利用の流れ
            </h2>
            <p className="text-lg text-muted-foreground">
              簡単5ステップで完了します
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { 
                  icon: Calendar, 
                  step: "STEP 1",
                  title: "予約", 
                  desc: "カレンダーから希望日時を選択して予約"
                },
                { 
                  icon: HomeIcon, 
                  step: "STEP 2",
                  title: "現地調査", 
                  desc: "専門スタッフが現地に訪問して調査"
                },
                { 
                  icon: CreditCard, 
                  step: "STEP 3",
                  title: "予約決済", 
                  desc: "調査後、作業の予約金を決済"
                },
                { 
                  icon: CheckCircle2, 
                  step: "STEP 4",
                  title: "作業終了", 
                  desc: "専門スタッフが作業を実施"
                },
                { 
                  icon: FileText, 
                  step: "STEP 5",
                  title: "残金決済", 
                  desc: "作業完了後、残金を決済"
                },
              ].map((item, idx) => (
                <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="text-xs">{item.step}</Badge>
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  {idx < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/flow">
                <Button variant="outline" size="lg">
                  詳しい利用方法を見る
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              こんな方におすすめ
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="mb-3">忙しくて時間がない</CardTitle>
              <CardDescription>
                24時間いつでもオンラインで予約可能。電話でのやり取り不要で、お好きなタイミングで予約できます。
              </CardDescription>
            </Card>
            <Card className="p-6">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="mb-3">安心して依頼したい</CardTitle>
              <CardDescription>
                正式な見積もりと契約書を発行。決済も安全なクレジットカード決済で、履歴も残ります。
              </CardDescription>
            </Card>
            <Card className="p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="mb-3">信頼できる業者を選びたい</CardTitle>
              <CardDescription>
                株式会社COLORSが直接対応。地域密着型のサービスで、アフターフォローも万全です。
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            今すぐ予約を始めましょう
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            リフォーム・塗装の現地調査を、24時間いつでも簡単に予約できます。
          </p>
          <Link href="/reserve">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              <Calendar className="w-5 h-5 mr-2" />
              予約カレンダーを見る
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                代表の想い
              </h2>
            </div>
            <Card className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  私たちの会社は、地元福岡で長年にわたり、塗装やリフォームを通じて多くのお客様の暮らしや仕事の環境を支えてきました。
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  建物や車は、ただの物ではなく、お客様の大切な財産です。
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  私たちは、その財産を守り、さらに価値を高めるために、誠心誠意を込めた仕事を続けています。
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  私たちが大切にしているのは、細部にまでこだわる職人の技と、お客様一人ひとりのご要望に寄り添う柔軟なプランニングです。単に塗装をするだけでなく、塗装後も長く安心していただけるような、心のこもったサービスを提供することを使命としています。
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                  「地域に貢献し、皆様の暮らしをより良いものにしたい」という思いで、この地で活動を続けてきました。<br />
                  これからも、皆様のご期待に応えられるよう、技術の向上とサービスの改善に努めてまいります。今後ともどうぞよろしくお願いいたします。
                </p>
                <div className="text-right border-t pt-6">
                  <p className="text-lg font-semibold text-foreground">代表取締役 竹原 悟史</p>
                </div>
              </div>
            </Card>

            {/* Company Information */}
            <Card className="mt-8 p-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">会社概要</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">会社名</div>
                    <div className="text-lg text-foreground">株式会社COLORS</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">代表者</div>
                    <div className="text-lg text-foreground">竹原 悟史</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">事業内容</div>
                    <div className="text-lg text-foreground">塗装・リフォーム</div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      電話番号
                    </div>
                    <div className="text-lg text-foreground">
                      <a href="tel:09061202995" className="hover:text-primary transition-colors">
                        090-6120-2995
                      </a>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      住所
                    </div>
                    <div className="text-lg text-foreground">
                      〒811-0202<br />
                      福岡県福岡市東区和白1丁目1番35号
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-bold text-foreground mb-4">サービス</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/cases" className="hover:text-foreground transition-colors">
                    施工事例
                  </Link>
                </li>
                <li>
                  <Link href="/reserve" className="hover:text-foreground transition-colors">
                    現地調査予約
                  </Link>
                </li>
                <li>
                  <Link href="/flow" className="hover:text-foreground transition-colors">
                    利用方法
                  </Link>
                </li>
                <li>
                  <Link href="/mypage" className="hover:text-foreground transition-colors">
                    マイページ
                  </Link>
                </li>
                <li>
                  <Link href="/view" className="hover:text-foreground transition-colors">
                    サイトマップ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">対応業務</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>住宅塗装・内装塗装</li>
                <li>施設塗装</li>
                <li>車体塗装</li>
                <li>リフォーム全般</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">お問い合わせ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:09061202995" className="hover:text-foreground transition-colors">
                    090-6120-2995
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <div>
                    <div>〒811-0202</div>
                    <div>福岡県福岡市東区和白1丁目1番35号</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>火・水・木 11:00〜18:00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t">
            <div className="text-center text-sm text-muted-foreground mb-4">
              © 2025 株式会社COLORS. All rights reserved.
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <Link href="/legal/commercial-transaction" className="hover:text-foreground transition-colors underline">
                特定商取引法に基づく表記
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
