import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingCalendar from "./pages/BookingCalendar";
import BookingForm from "./pages/BookingForm";
import BookingPayment from "./pages/BookingPayment";
import BookingSuccess from "./pages/BookingSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerMypage from "./pages/CustomerMypage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking/calendar" element={<BookingCalendar />} />
          <Route path="/booking/form" element={<BookingForm />} />
          <Route path="/booking/payment" element={<BookingPayment />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/customer/mypage" element={<CustomerMypage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
