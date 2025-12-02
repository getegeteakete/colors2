import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CreditCard, AlertCircle, TrendingUp, Clock, CheckCircle2, Video, MapPin } from "lucide-react";

const AdminDashboard = () => {
  const kpiData = [
    { title: "今日の予約", value: "8件", icon: Calendar, color: "bg-primary", trend: "+12%" },
    { title: "今週の予約", value: "45件", icon: Clock, color: "bg-accent", trend: "+8%" },
    { title: "未完了の調査", value: "3件", icon: AlertCircle, color: "bg-status-warning", trend: "-2%" },
    { title: "支払待ち", value: "2件", icon: CreditCard, color: "bg-status-error", trend: "0%" },
  ];

  const recentBookings = [
    { id: 1, customer: "田中様", type: "visit", date: "2025-12-05 10:00", status: "confirmed", amount: 5000 },
    { id: 2, customer: "佐藤様", type: "zoom", date: "2025-12-05 14:00", status: "confirmed", amount: 5000 },
    { id: 3, customer: "鈴木様", type: "visit", date: "2025-12-06 09:00", status: "pending", amount: 5000 },
    { id: 4, customer: "高橋様", type: "zoom", date: "2025-12-06 11:00", status: "completed", amount: 5000 },
    { id: 5, customer: "伊藤様", type: "visit", date: "2025-12-09 10:00", status: "confirmed", amount: 5000 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-status-info/10 text-status-info",
      pending: "bg-status-warning/10 text-status-warning",
      completed: "bg-status-success/10 text-status-success",
    };
    const labels = {
      confirmed: "予約済",
      pending: "支払待ち",
      completed: "完了",
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">COLORS 管理画面</span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm">予約一覧</Button>
              <Button variant="ghost" size="sm">決済管理</Button>
              <Button variant="ghost" size="sm">顧客管理</Button>
              <Button variant="ghost" size="sm">設定</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ダッシュボード</h1>
          <p className="text-muted-foreground">予約状況と業務の概要</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, idx) => (
            <Card key={idx} className="p-6 shadow-card hover:shadow-card-hover transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-status-success" />
                  <span className="text-status-success font-medium">{kpi.trend}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2 p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">最近の予約</h2>
              <Button variant="ghost" size="sm">すべて表示</Button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-smooth cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    booking.type === "visit" ? "bg-primary" : "bg-accent"
                  }`}>
                    {booking.type === "visit" ? (
                      <MapPin className="w-5 h-5 text-white" />
                    ) : (
                      <Video className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground truncate">{booking.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(booking.status)}
                    <p className="font-bold text-foreground whitespace-nowrap">
                      ¥{booking.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6">クイックアクション</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start gradient-primary text-primary-foreground hover:opacity-90">
                <Calendar className="w-5 h-5 mr-2" />
                予約を追加
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-5 h-5 mr-2" />
                顧客を追加
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-5 h-5 mr-2" />
                決済を確認
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                調査を完了
              </Button>
            </div>

            <div className="mt-8 p-4 bg-accent-light rounded-lg">
              <h3 className="font-medium text-accent-foreground mb-2">営業時間</h3>
              <p className="text-sm text-accent-foreground">平日 9:00 - 18:00</p>
              <p className="text-sm text-accent-foreground">土曜 9:00 - 17:00</p>
              <p className="text-sm text-accent-foreground">日曜・祝日 休業</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
