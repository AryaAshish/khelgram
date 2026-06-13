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
          pre_registration_allowed: boolean
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
          pre_registration_allowed?: boolean
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
          pre_registration_allowed?: boolean
          registered_count?: number
          slug?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string
          created_at: string
          id: string
          path: string
          size: number
          url: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id: string
          path: string
          size?: number
          url: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          path?: string
          size?: number
          url?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          id: string
          name: string
          photo_url: string | null
          published: boolean
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string
          id: string
          name: string
          photo_url?: string | null
          published?: boolean
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string
          id?: string
          name?: string
          photo_url?: string | null
          published?: boolean
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      contributors: {
        Row: {
          contribution: string
          id: string
          name: string
          photo_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          contribution: string
          id: string
          name: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          contribution?: string
          id?: string
          name?: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          tier: string
          updated_at: string
          website: string | null
        }
        Insert: {
          id: string
          logo_url?: string | null
          name: string
          sort_order?: number
          tier: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          id: string
          photo_url: string | null
          quote: string
          relation: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author: string
          id: string
          photo_url?: string | null
          quote: string
          relation?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          id?: string
          photo_url?: string | null
          quote?: string
          relation?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          id: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          id?: string
          question?: string
          sort_order?: number
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
          scope: string
          sort_order: number
          stat_key: string | null
          updated_at: string
          value: string
        }
        Insert: {
          id: string
          label: string
          scope?: string
          sort_order?: number
          stat_key?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          scope?: string
          sort_order?: number
          stat_key?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          cta_label: string | null
          cta_url: string | null
          description: string
          icon: string | null
          id: string
          pillar: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          cta_label?: string | null
          cta_url?: string | null
          description?: string
          icon?: string | null
          id: string
          pillar: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          cta_label?: string | null
          cta_url?: string | null
          description?: string
          icon?: string | null
          id?: string
          pillar?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
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
