/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          correo_electronico: string  // Tu campo se llama así
          full_name: string | null
          whatsapp: string | null
          affiliate_link: string | null
          avatar_url: string | null
          biografico: string | null
          preferencias: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          correo_electronico: string
          full_name?: string | null
          whatsapp?: string | null
          affiliate_link?: string | null
          avatar_url?: string | null
          biografico?: string | null
          preferencias?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          correo_electronico?: string
          full_name?: string | null
          whatsapp?: string | null
          affiliate_link?: string | null
          avatar_url?: string | null
          biografico?: string | null
          preferencias?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
