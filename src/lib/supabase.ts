import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'student' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          instructor_name: string;
          instructor_bio: string | null;
          price: number;
          thumbnail_url: string | null;
          level: 'beginner' | 'intermediate' | 'advanced';
          category_id: string | null;
          tags: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          batch_id: string | null;
          enrolled_at: string;
          progress_percentage: number;
          completed_at: string | null;
          status: 'active' | 'completed' | 'dropped';
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          video_url: string;
          duration_minutes: number;
          order_index: number;
          is_free_preview: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          watch_time_seconds: number;
        };
      };
    };
  };
};
