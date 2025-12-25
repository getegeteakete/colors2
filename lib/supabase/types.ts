export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          user_id: string;
          type: 'onsite' | 'zoom';
          date: string;
          time: string;
          address: string | null;
          content: string;
          photos: string[];
          zoom_url: string | null;
          ai_price: number | null;
          status: 'reserved' | 'done' | 'estimated';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'onsite' | 'zoom';
          date: string;
          time: string;
          address?: string | null;
          content: string;
          photos?: string[];
          zoom_url?: string | null;
          ai_price?: number | null;
          status?: 'reserved' | 'done' | 'estimated';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'onsite' | 'zoom';
          date?: string;
          time?: string;
          address?: string | null;
          content?: string;
          photos?: string[];
          zoom_url?: string | null;
          ai_price?: number | null;
          status?: 'reserved' | 'done' | 'estimated';
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          reservation_id: string;
          stripe_intent: string | null;
          amount: number;
          status: 'pending' | 'paid' | 'refunded';
          invoice_pdf_url: string | null;
          receipt_pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          stripe_intent?: string | null;
          amount: number;
          status?: 'pending' | 'paid' | 'refunded';
          invoice_pdf_url?: string | null;
          receipt_pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          stripe_intent?: string | null;
          amount?: number;
          status?: 'pending' | 'paid' | 'refunded';
          invoice_pdf_url?: string | null;
          receipt_pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          staff_id: string;
          date: string;
          time: string;
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          date: string;
          time: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          staff_id?: string;
          date?: string;
          time?: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};








