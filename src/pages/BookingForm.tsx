import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, MapPin, Upload, ChevronRight, Sparkles } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingType = searchParams.get("type") || "visit";
  const selectedDate = searchParams.get("date") || "";
  const selectedTime = searchParams.get("time") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    details: "",
  });

  const [aiEstimate] = useState("¥180,000 〜 ¥250,000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking/payment?type=${bookingType}&date=${selectedDate}&time=${selectedTime}`);
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">COLORS調査予約</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-fast">トップ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/booking/calendar" className="hover:text-foreground transition-fast">日時選択</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">予約情報入力</span>
          </div>

          {/* Selected Info */}
          <Card className="p-6 mb-8 shadow-card">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                bookingType === "visit" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-accent text-accent-foreground"
              }`}>
                {bookingType === "visit" ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span className="font-medium">
                  {bookingType === "visit" ? "現地調査" : "オンライン相談"}
                </span>
              </div>
              <div className="text-foreground font-medium">
                {new Date(selectedDate).toLocaleDateString("ja-JP")} {selectedTime}
              </div>
            </div>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card className="p-8 shadow-card mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">お客様情報</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">お名前 *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="山田 太郎"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">メールアドレス *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">電話番号 *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="090-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                {bookingType === "visit" && (
                  <div>
                    <Label htmlFor="address">現場住所 *</Label>
                    <Input
                      id="address"
                      required
                      placeholder="東京都渋谷区..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="details">相談内容 *</Label>
                  <Textarea
                    id="details"
                    required
                    rows={6}
                    placeholder="外壁塗装を検討しています。築15年の木造2階建てです..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>現場写真（任意）</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      クリックまたはドラッグ&ドロップで画像をアップロード
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Estimate */}
            <Card className="p-6 bg-accent-light border-accent/20 shadow-card mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-accent-foreground mb-2">AI概算費用</h3>
                  <p className="text-sm text-accent-foreground mb-3">
                    入力内容から自動算出された概算費用です
                  </p>
                  <div className="text-2xl font-bold text-accent-foreground">
                    {aiEstimate}
                  </div>
                  <p className="text-xs text-accent-foreground/70 mt-2">
                    ※実際の見積もりは調査後に提示いたします
                  </p>
                </div>
              </div>
            </Card>

            <Button 
              type="submit"
              size="lg"
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-smooth shadow-lg"
            >
              予約を確定して決済へ進む
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
