export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          age_group: string
          capacity: number | null
          description: string
          icon: string | null
          id: string
          name: string
          registered_count: number
          slug: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          age_group: string
          capacity?: number | null
          description: string
          icon?: string | null
          id: string
          name: string
          registered_count?: number
          slug: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          age_group?: string
          capacity?: number | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          registered_count?: number
          slug?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string
          caption: string | null
          id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          alt: string
          caption?: string | null
          id: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          caption?: string | null
          id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          id: string
          label: string
          sort_order: number
          stat_key: string | null
          updated_at: string
          value: string
        }
        Insert: {
          id: string
          label: string
          sort_order?: number
          stat_key?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          stat_key?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      registration_games: {
        Row: {
          game_id: string
          registration_id: string
          status: string
        }
        Insert: {
          game_id: string
          registration_id: string
          status?: string
        }
        Update: {
          game_id?: string
          registration_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'registration_games_game_id_fkey'
            columns: ['game_id']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'registration_games_registration_id_fkey'
            columns: ['registration_id']
            isOneToOne: false
            referencedRelation: 'registrations'
            referencedColumns: ['id']
          },
        ]
      }
      registrations: {
        Row: {
          age: number
          child_name: string
          code: string
          created_at: string
          email: string
          id: string
          parent_name: string
          phone: string
          status: string
        }
        Insert: {
          age: number
          child_name: string
          code?: string
          created_at?: string
          email: string
          id?: string
          parent_name: string
          phone: string
          status?: string
        }
        Update: {
          age?: number
          child_name?: string
          code?: string
          created_at?: string
          email?: string
          id?: string
          parent_name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          section: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_registration_duplicate: {
        Args: {
          p_email: string
          p_game_id: string
        }
        Returns: boolean
      }
      get_registration_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
