import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, CreditCard, User, MapPin, Video, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerMypage = () => {
  const bookingHistory = [
    { id: 1, type: "visit", date: "2025-11-20", time: "10:00", status: "completed", amount: 5000 },
    { id: 2, type: "zoom", date: "2025-12-05", time: "14:00", status: "confirmed", amount: 5000 },
    { id: 3, type: "visit", date: "2025-12-12", time: "10:00", status: "confirmed", amount: 5000 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-status-info/10 text-status-info",
      completed: "bg-status-success/10 text-status-success",
    };
    const labels = {
      confirmed: "予約済",
      completed: "調査完了",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">COLORS調査予約</span>
            </Link>
            <Button variant="outline" size="sm">ログアウト</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">マイページ</h1>
            <p className="text-muted-foreground">山田 太郎 様</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Booking History */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-bold text-foreground mb-6">予約履歴</h2>
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-smooth">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            booking.type === "visit" ? "bg-primary" : "bg-accent"
                          }`}>
                            {booking.type === "visit" ? (
                              <MapPin className="w-5 h-5 text-white" />
                            ) : (
                              <Video className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {booking.type === "visit" ? "現地調査" : "オンライン相談"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString("ja-JP")} {booking.time}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="text-sm font-medium text-foreground">
                          予約金: ¥{booking.amount.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          {booking.status === "completed" && (
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              見積書
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            領収書
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Payment History */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-bold text-foreground mb-6">支払履歴</h2>
                <div className="space-y-3">
                  {[
                    { date: "2025-11-20", description: "現地調査予約金", amount: 5000, status: "paid" },
                    { date: "2025-12-05", description: "オンライン相談予約金", amount: 5000, status: "paid" },
                    { date: "2025-12-12", description: "現地調査予約金", amount: 5000, status: "paid" },
                  ].map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">¥{payment.amount.toLocaleString()}</p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-bold text-foreground mb-4">アカウント情報</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">お名前</p>
                    <p className="font-medium text-foreground">山田 太郎</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">メールアドレス</p>
                    <p className="font-medium text-foreground">yamada@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">電話番号</p>
                    <p className="font-medium text-foreground">090-1234-5678</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <User className="w-4 h-4 mr-2" />
                  情報を編集
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-bold text-foreground mb-4">クイックアクション</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start gradient-primary text-primary-foreground hover:opacity-90" asChild>
                    <Link to="/booking/calendar">
                      <Calendar className="w-4 h-4 mr-2" />
                      新しい予約
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    支払方法の管理
                  </Button>
                </div>
              </Card>

              {/* Support Card */}
              <Card className="p-6 bg-accent-light shadow-card">
                <h3 className="font-bold text-accent-foreground mb-3">サポート</h3>
                <p className="text-sm text-accent-foreground mb-4">
                  ご不明な点がございましたら、お気軽にお問い合わせください。
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  お問い合わせ
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMypage;
