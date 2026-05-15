export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_reflections: {
        Row: {
          created_at: string
          daily_score: number | null
          feedback_en: string | null
          feedback_hi: string | null
          feedback_te: string | null
          focus_question: string | null
          id: string
          log_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_score?: number | null
          feedback_en?: string | null
          feedback_hi?: string | null
          feedback_te?: string | null
          focus_question?: string | null
          id?: string
          log_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_score?: number | null
          feedback_en?: string | null
          feedback_hi?: string | null
          feedback_te?: string | null
          focus_question?: string | null
          id?: string
          log_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      brahmacharya_days: {
        Row: {
          created_at: string
          id: string
          log_date: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      brahmacharya_journey: {
        Row: {
          best_streak: number
          created_at: string
          current_phase: number
          current_streak: number
          id: string
          phase1_target: number
          phase2_target: number
          started_on: string
          total_clean_days: number
          total_slips: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          created_at?: string
          current_phase?: number
          current_streak?: number
          id?: string
          phase1_target?: number
          phase2_target?: number
          started_on?: string
          total_clean_days?: number
          total_slips?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          created_at?: string
          current_phase?: number
          current_streak?: number
          id?: string
          phase1_target?: number
          phase2_target?: number
          started_on?: string
          total_clean_days?: number
          total_slips?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_messages: {
        Row: {
          coach_mode: string | null
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          coach_mode?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          coach_mode?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      curriculum_progress: {
        Row: {
          id: string
          percent: number
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          percent?: number
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          percent?: number
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          anulom_vilom: boolean
          created_at: string
          deep_work_blocks: number
          dsa_problems: number
          energy: number
          evening_reflection: Json | null
          fasting: boolean
          focus: number
          hanuman_chalisa_count: number
          hanuman_chalisa_done: boolean
          id: string
          instagram_minutes: number
          jam_speaking: boolean
          log_date: string
          meditation: boolean
          mirror_speaking: boolean
          naam_jap_count: number
          naam_jap_done: boolean
          notes: string | null
          phone_pickups: number
          pillar_communication: boolean
          pillar_ethics: boolean
          pillar_influence: boolean
          pillar_power: boolean
          pillar_wealth: boolean
          pullups: number
          pushups: number
          random_speaking: number
          react_learning: boolean
          revision: boolean
          squats: number
          temple_visit: boolean
          updated_at: string
          urges: number
          user_id: string
          videos_today: number
          youtube_minutes: number
        }
        Insert: {
          anulom_vilom?: boolean
          created_at?: string
          deep_work_blocks?: number
          dsa_problems?: number
          energy?: number
          evening_reflection?: Json | null
          fasting?: boolean
          focus?: number
          hanuman_chalisa_count?: number
          hanuman_chalisa_done?: boolean
          id?: string
          instagram_minutes?: number
          jam_speaking?: boolean
          log_date: string
          meditation?: boolean
          mirror_speaking?: boolean
          naam_jap_count?: number
          naam_jap_done?: boolean
          notes?: string | null
          phone_pickups?: number
          pillar_communication?: boolean
          pillar_ethics?: boolean
          pillar_influence?: boolean
          pillar_power?: boolean
          pillar_wealth?: boolean
          pullups?: number
          pushups?: number
          random_speaking?: number
          react_learning?: boolean
          revision?: boolean
          squats?: number
          temple_visit?: boolean
          updated_at?: string
          urges?: number
          user_id: string
          videos_today?: number
          youtube_minutes?: number
        }
        Update: {
          anulom_vilom?: boolean
          created_at?: string
          deep_work_blocks?: number
          dsa_problems?: number
          energy?: number
          evening_reflection?: Json | null
          fasting?: boolean
          focus?: number
          hanuman_chalisa_count?: number
          hanuman_chalisa_done?: boolean
          id?: string
          instagram_minutes?: number
          jam_speaking?: boolean
          log_date?: string
          meditation?: boolean
          mirror_speaking?: boolean
          naam_jap_count?: number
          naam_jap_done?: boolean
          notes?: string | null
          phone_pickups?: number
          pillar_communication?: boolean
          pillar_ethics?: boolean
          pillar_influence?: boolean
          pillar_power?: boolean
          pillar_wealth?: boolean
          pullups?: number
          pushups?: number
          random_speaking?: number
          react_learning?: boolean
          revision?: boolean
          squats?: number
          temple_visit?: boolean
          updated_at?: string
          urges?: number
          user_id?: string
          videos_today?: number
          youtube_minutes?: number
        }
        Relationships: []
      }
      daily_video_completions: {
        Row: {
          created_at: string
          id: string
          log_date: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          content: string
          created_at: string
          horizon: string
          id: string
          pinned: boolean
          start_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          horizon?: string
          id?: string
          pinned?: boolean
          start_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          horizon?: string
          id?: string
          pinned?: boolean
          start_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_academy_items: {
        Row: {
          content: Json
          created_at: string
          id: string
          section: string
          title: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          section: string
          title: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section?: string
          title?: string
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
