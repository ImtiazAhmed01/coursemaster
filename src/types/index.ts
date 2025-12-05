export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  batch_id: string | null;
  enrolled_at: string;
  progress_percentage: number;
  completed_at: string | null;
  status: 'active' | 'completed' | 'dropped';
}

export interface Lesson {
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
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  watch_time_seconds: number;
}

export interface Assignment {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string;
  due_date: string | null;
  max_score: number;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  submission_text: string | null;
  submission_url: string | null;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_points: number;
  answers: Record<string, string>;
  started_at: string;
  completed_at: string | null;
}
