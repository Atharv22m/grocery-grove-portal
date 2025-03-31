
import { Database } from "@/integrations/supabase/types";

// Extended Database type that includes our orders tables
export type DatabaseExtended = Database & {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          name?: string;
          created_at?: string;
        };
      };
      order_delivery_info: {
        Row: {
          id: string;
          order_id: string;
          full_name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          phone_number: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          full_name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          phone_number: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          full_name?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          phone_number?: string;
        };
      };
      order_payment_info: {
        Row: {
          id: string;
          order_id: string;
          method: string;
          total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          method: string;
          total: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          method?: string;
          total?: number;
        };
      };
    } & Database['public']['Tables'];
  };
};
