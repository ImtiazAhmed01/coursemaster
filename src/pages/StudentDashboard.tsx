import { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface EnrolledCourse {
  id: string;
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  status: string;
  course: {
    title: string;
    slug: string;
    description: string;
    instructor_name: string;
    level: string;
  };
}

interface StudentDashboardProps {
  onNavigate: (page: string, param?: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  async function fetchEnrollments() {
    setLoading(true);

    const { data } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        course:courses(title, slug, description, instructor_name, level)
      `
      )
      .eq('user_id', user!.id)
      .order('enrolled_at', { ascending: false });

    if (data) {
      setEnrollments(data as any);
    }

    setLoading(false);
  }

  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed');
  const totalProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length
        )
      : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-blue-100">Track your progress and continue your learning journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Enrolled Courses</span>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{enrollments.length}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active Courses</span>
              <PlayCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{activeEnrollments.length}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Completed</span>
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{completedEnrollments.length}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Avg Progress</span>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalProgress}%</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <button
              onClick={() => onNavigate('home')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Browse More Courses
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading your courses...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {enrollment.course.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                            enrollment.course.level
                          )}`}
                        >
                          {enrollment.course.level}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {enrollment.course.description}
                      </p>

                      <p className="text-sm text-gray-500">
                        Instructor: {enrollment.course.instructor_name}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                      <div className="w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{enrollment.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('course-learn', enrollment.course.slug)}
                        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
