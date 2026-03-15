/**
 * Database types for Supabase.
 * Keep in sync with supabase/migrations/20240313000000_create_applications.sql
 */
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          job_id: string;
          job_code: string;
          job_title: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          linked_in: string | null;
          portfolio: string | null;
          current_company: string | null;
          current_title: string | null;
          years_of_experience: string;
          expected_salary: string | null;
          notice_period: string;
          work_authorization: string;
          cover_letter: string | null;
          heard_about: string | null;
          resume_file_name: string | null;
          resume_file_size: number | null;
          resume_storage_path: string | null;
          submitted_at: string;
          application_reference: string;
          created_at: string;
        };
        Insert: {
          id: string;
          job_id: string;
          job_code: string;
          job_title: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          linked_in?: string | null;
          portfolio?: string | null;
          current_company?: string | null;
          current_title?: string | null;
          years_of_experience: string;
          expected_salary?: string | null;
          notice_period: string;
          work_authorization: string;
          cover_letter?: string | null;
          heard_about?: string | null;
          resume_file_name?: string | null;
          resume_file_size?: number | null;
          resume_storage_path?: string | null;
          submitted_at: string;
          application_reference: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
