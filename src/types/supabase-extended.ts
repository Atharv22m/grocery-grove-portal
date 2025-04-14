
export interface DatabaseExtended {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          quantity: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          quantity?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          image: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image?: string;
          name?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          image_url: string;
          name: string;
          price: number;
          seller_id: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description?: string;
          id?: string;
          image_url?: string;
          name: string;
          price: number;
          seller_id?: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image_url?: string;
          name?: string;
          price?: number;
          seller_id?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey";
            columns: ["seller_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string;
          full_name: string;
          id: string;
          updated_at: string;
          username: string;
          website: string;
          address: string;
          bio: string;
          phone_number: string;
          role_id: string;
          preferences: Record<string, any>;
          metadata: Record<string, any>;
          account_status: string;
          last_login_at: string;
          account_settings: Record<string, any>;
        };
        Insert: {
          avatar_url?: string;
          full_name?: string;
          id: string;
          updated_at?: string;
          username: string;
          website?: string;
          address?: string;
          bio?: string;
          phone_number?: string;
          role_id?: string;
          preferences?: Record<string, any>;
          metadata?: Record<string, any>;
          account_status?: string;
          last_login_at?: string;
          account_settings?: Record<string, any>;
        };
        Update: {
          avatar_url?: string;
          full_name?: string;
          id?: string;
          updated_at?: string;
          username?: string;
          website?: string;
          address?: string;
          bio?: string;
          phone_number?: string;
          role_id?: string;
          preferences?: Record<string, any>;
          metadata?: Record<string, any>;
          account_status?: string;
          last_login_at?: string;
          account_settings?: Record<string, any>;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "user_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          id: string;
          name: string;
          description: string;
          permissions: Record<string, boolean>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          permissions?: Record<string, boolean>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          permissions?: Record<string, boolean>;
          created_at?: string;
        };
        Relationships: [];
      };
      user_role_mappings: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_role_mappings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_role_mappings_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "user_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
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
          created_at: string;
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
          created_at?: string;
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
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_delivery_info_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      order_payment_info: {
        Row: {
          id: string;
          order_id: string;
          method: string;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          method: string;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          method?: string;
          total?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_payment_info_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      get_user_permissions: {
        Args: {
          user_id: string;
        };
        Returns: Record<string, boolean>;
      };
      has_permission: {
        Args: {
          user_id: string;
          permission: string;
        };
        Returns: boolean;
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
}
