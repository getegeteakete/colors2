import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, Video, Download, Home } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingType = searchParams.get("type") || "visit";

  const zoomUrl = "https://zoom.us/j/1234567890"; // Mock Zoom URL

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 md:p-12 text-center shadow-card">
          <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-status-success" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            予約が完了しました！
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            ご予約ありがとうございます。<br />
            確認メールをお送りしましたので、ご確認ください。
          </p>

          {bookingType === "zoom" && (
            <div className="p-6 bg-accent-light rounded-lg mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="text-xl font-bold text-accent-foreground">Zoom URL</h2>
              </div>
              <p className="text-sm text-accent-foreground mb-3">
                当日は以下のURLからご参加ください
              </p>
              <div className="p-3 bg-card rounded border border-accent/20">
                <a 
                  href={zoomUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {zoomUrl}
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-status-success" />
              <span>リマインドメールを前日に送信します</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-status-success" />
              <span>領収書はマイページからダウンロード可能</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 transition-smooth" asChild>
              <Link to="/customer/mypage">
                <Calendar className="w-5 h-5 mr-2" />
                マイページへ
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                トップへ戻る
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;
