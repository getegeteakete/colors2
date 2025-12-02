import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CreditCard, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const BookingPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingType = searchParams.get("type") || "visit";
  const selectedDate = searchParams.get("date") || "";
  const selectedTime = searchParams.get("time") || "";

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const amount = 5000; // 予約金

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/booking/success");
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
            <Link to="/booking/form" className="hover:text-foreground transition-fast">情報入力</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">決済</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <Card className="lg:col-span-3 p-8 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">カード情報入力</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="cardNumber">カード番号</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">カード名義</Label>
                  <Input
                    id="cardName"
                    placeholder="TARO YAMADA"
                    required
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">有効期限</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      required
                      value={paymentData.expiry}
                      onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">セキュリティコード</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      required
                      maxLength={3}
                      value={paymentData.cvc}
                      onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-accent-light rounded-lg">
                  <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-accent-foreground">
                    このサイトはSSL暗号化通信により保護されています。カード情報は安全に処理されます。
                  </p>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-smooth shadow-lg"
                >
                  ¥{amount.toLocaleString()} を支払う
                </Button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <img src="/placeholder.svg" alt="Visa" className="h-6 opacity-50" />
                <img src="/placeholder.svg" alt="Mastercard" className="h-6 opacity-50" />
                <img src="/placeholder.svg" alt="JCB" className="h-6 opacity-50" />
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="lg:col-span-2 p-6 shadow-card h-fit">
              <h3 className="text-xl font-bold text-foreground mb-6">予約内容確認</h3>
              
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-2">予約タイプ</p>
                  <p className="font-medium text-foreground">
                    {bookingType === "visit" ? "現地調査" : "オンライン相談（Zoom）"}
                  </p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-2">日時</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedDate).toLocaleDateString("ja-JP")}
                  </p>
                  <p className="font-medium text-foreground">{selectedTime}</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-2">予約金</p>
                  <p className="text-2xl font-bold text-foreground">
                    ¥{amount.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span className="text-muted-foreground">調査完了後に見積提示</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span className="text-muted-foreground">キャンセルポリシーあり</span>
                  </div>
                  {bookingType === "zoom" && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-status-success" />
                      <span className="text-muted-foreground">Zoom URL自動発行</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPayment;
