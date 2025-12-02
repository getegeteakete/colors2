import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Video, MapPin, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const BookingCalendar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingType = searchParams.get("type") || "visit";
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data for available slots
  const availableSlots = [
    { date: "2025-12-05", times: ["10:00", "14:00", "16:00"] },
    { date: "2025-12-06", times: ["09:00", "11:00", "15:00"] },
    { date: "2025-12-09", times: ["10:00", "13:00", "16:00"] },
    { date: "2025-12-10", times: ["09:00", "14:00", "17:00"] },
    { date: "2025-12-12", times: ["10:00", "11:00", "15:00"] },
  ];

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const hasSlots = (day: number | null) => {
    if (!day) return false;
    const dateStr = formatDate(day);
    return availableSlots.some((slot) => slot.date === dateStr);
  };

  const getTimeSlotsForDate = (dateStr: string) => {
    const slot = availableSlots.find((s) => s.date === dateStr);
    return slot?.times || [];
  };

  const handleDateSelect = (day: number | null) => {
    if (!day || !hasSlots(day)) return;
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate(`/booking/form?type=${bookingType}&date=${selectedDate}&time=${selectedTime}`);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-fast">トップ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">予約日時選択</span>
          </div>

          {/* Booking Type Badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              bookingType === "visit" 
                ? "bg-primary text-primary-foreground" 
                : "bg-accent text-accent-foreground"
            }`}>
              {bookingType === "visit" ? (
                <><MapPin className="w-4 h-4" /><span className="font-medium">現地調査</span></>
              ) : (
                <><Video className="w-4 h-4" /><span className="font-medium">オンライン相談（Zoom）</span></>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Calendar Section */}
            <Card className="lg:col-span-3 p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {getDaysInMonth().map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDateSelect(day)}
                    disabled={!hasSlots(day)}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-smooth
                      ${!day ? "invisible" : ""}
                      ${hasSlots(day) 
                        ? "bg-secondary hover:bg-primary hover:text-primary-foreground cursor-pointer" 
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      }
                      ${selectedDate === formatDate(day!) ? "bg-primary text-primary-foreground ring-2 ring-accent" : ""}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <span>予約可能</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>選択中</span>
                </div>
              </div>
            </Card>

            {/* Time Slots Section */}
            <Card className="lg:col-span-2 p-6 shadow-card">
              <h3 className="text-xl font-bold text-foreground mb-6">時間を選択</h3>
              
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    カレンダーから日付を<br />選択してください
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(selectedDate).toLocaleDateString("ja-JP", { 
                      month: "long", 
                      day: "numeric",
                      weekday: "short"
                    })}
                  </p>
                  {getTimeSlotsForDate(selectedDate).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        w-full p-4 rounded-lg text-left font-medium transition-smooth
                        ${selectedTime === time
                          ? "bg-primary text-primary-foreground ring-2 ring-accent"
                          : "bg-secondary hover:bg-primary/10"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" />
                        <span>{time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-accent-light rounded-lg">
                    <p className="text-sm text-accent-foreground font-medium mb-2">選択内容</p>
                    <p className="text-sm text-accent-foreground">
                      {new Date(selectedDate).toLocaleDateString("ja-JP")} {selectedTime}
                    </p>
                  </div>
                  <Button 
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-smooth"
                    onClick={handleContinue}
                  >
                    次へ進む
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
