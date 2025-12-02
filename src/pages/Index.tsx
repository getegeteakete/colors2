import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Video, Sparkles, CheckCircle2, ArrowRight, Star, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">COLORS調査予約</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/examples" className="text-sm text-muted-foreground hover:text-foreground transition-fast">施工事例</Link>
            <Link to="/flow" className="text-sm text-muted-foreground hover:text-foreground transition-fast">決済の流れ</Link>
            <Link to="/customer/mypage" className="text-sm text-muted-foreground hover:text-foreground transition-fast">マイページ</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-light py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light text-accent-foreground text-sm font-medium mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-4 h-4" />
              <span>オンライン予約でスムーズに</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
              現地調査・オンライン相談を、<br />
              Web予約でスムーズに。
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
              株式会社COLORSの調査予約システム。<br className="md:hidden" />
              日程選択から決済まで、すべてオンラインで完結します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-top-10 duration-700 delay-500">
              <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 transition-smooth shadow-lg" asChild>
                <Link to="/booking/calendar?type=visit">
                  <Calendar className="w-5 h-5 mr-2" />
                  現地調査を予約する
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth" asChild>
                <Link to="/booking/calendar?type=zoom">
                  <Video className="w-5 h-5 mr-2" />
                  オンライン相談（Zoom）
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              予約の流れ
            </h2>
            <p className="text-muted-foreground text-lg">
              シンプルな5ステップで完了
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Calendar, title: "日程を選ぶ", desc: "空き枠から選択" },
              { icon: Mail, title: "内容入力", desc: "相談内容を記入" },
              { icon: Video, title: "自動発行", desc: "ZoomリンクまたはKR" },
              { icon: CheckCircle2, title: "決済", desc: "カード決済完了" },
              { icon: Star, title: "当日案内", desc: "リマインド通知" },
            ].map((step, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-card-hover transition-smooth bg-card">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-sm font-medium text-accent mb-2">STEP {idx + 1}</div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-card shadow-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">リアルタイム空き枠</h3>
              <p className="text-muted-foreground">
                担当者のスケジュールと連携し、最新の空き枠を表示。ダブルブッキングの心配なし。
              </p>
            </Card>
            <Card className="p-8 bg-card shadow-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI概算費用</h3>
              <p className="text-muted-foreground">
                入力内容から自動で概算費用を表示。事前に目安がわかるので安心です。
              </p>
            </Card>
            <Card className="p-8 bg-card shadow-card hover:shadow-card-hover transition-smooth">
              <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center mb-6">
                <Video className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Zoom自動発行</h3>
              <p className="text-muted-foreground">
                オンライン相談の場合、予約確定と同時にZoomリンクを自動発行します。
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              お客様の声
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground">平均評価 4.9 / 5.0</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "田中様", comment: "Web予約で時間を気にせず申し込めて便利でした。Zoomでの相談も丁寧で安心しました。", rating: 5 },
              { name: "佐藤様", comment: "現地調査の予約から決済まで全てスムーズ。領収書もすぐダウンロードできて助かりました。", rating: 5 },
              { name: "鈴木様", comment: "AI概算費用が事前にわかるのが良かったです。実際の見積もりとほぼ同じでした。", rating: 5 },
            ].map((review, idx) => (
              <Card key={idx} className="p-6 bg-card shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{review.comment}</p>
                <p className="font-medium text-foreground">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            今すぐ予約を始めましょう
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            現地調査もオンライン相談も、24時間いつでもWeb予約可能です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-card text-foreground hover:bg-card/90 transition-smooth shadow-lg" asChild>
              <Link to="/booking/calendar?type=visit">
                現地調査を予約
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-smooth" asChild>
              <Link to="/booking/calendar?type=zoom">
                オンライン相談
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">COLORS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                株式会社COLORS<br />
                調査予約システム
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">サービス</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/booking/calendar" className="hover:text-foreground transition-fast">現地調査予約</Link></li>
                <li><Link to="/booking/calendar" className="hover:text-foreground transition-fast">オンライン相談</Link></li>
                <li><Link to="/examples" className="hover:text-foreground transition-fast">施工事例</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">サポート</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/flow" className="hover:text-foreground transition-fast">決済の流れ</Link></li>
                <li><Link to="/customer/mypage" className="hover:text-foreground transition-fast">マイページ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">お問い合わせ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>03-XXXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@colors.co.jp</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 株式会社COLORS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
