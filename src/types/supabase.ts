export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      codes: {
        Row: {
          code: string
          description_short: string
          national_wrvu: number
        }
        Insert: {
          code: string
          description_short: string
          national_wrvu: number
        }
        Update: {
          code?: string
          description_short?: string
          national_wrvu?: number
        }
      }
      checklists: {
        Row: {
          id: string
          title: string
          description: string
          checklist_type: string
          source: string | null
        }
        Insert: {
          id: string
          title: string
          description: string
          checklist_type: string
          source?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          checklist_type?: string
          source?: string | null
        }
      }
      modifiers: {
        Row: {
          code: string
          description: string
        }
        Insert: {
          code: string
          description: string
        }
        Update: {
          code?: string
          description?: string
        }
      }
      smart_phrases: {
        Row: {
          id: string
          title: string
          content: string
        }
        Insert: {
          id: string
          title: string
          content: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
        }
      }
    }
  }
}
