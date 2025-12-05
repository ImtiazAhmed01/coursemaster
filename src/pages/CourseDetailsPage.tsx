import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, BarChart3, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Course, Lesson, Enrollment } from '../types';

interface CourseDetailsPageProps {
  courseSlug: string;
  onNavigate: (page: string, param?: string) => void;
}

export function CourseDetailsPage({ courseSlug, onNavigate }: CourseDetailsPageProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseSlug, user]);

  async function fetchCourseDetails() {
    setLoading(true);

    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .maybeSingle();

    if (courseData) {
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('order_index');

      if (lessonsData) setLessons(lessonsData);

      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle();

        if (enrollmentData) setEnrollment(enrollmentData);
      }
    }

    setLoading(false);
  }

  async function handleEnroll() {
    if (!user) {
      onNavigate('login');
      return;
    }

    setEnrolling(true);

    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: course!.id,
      status: 'active',
    });

    if (!error) {
      onNavigate('student-dashboard');
    } else {
      alert('Failed to enroll: ' + error.message);
    }

    setEnrolling(false);
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{totalDuration} minutes</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-gray-900 h-fit shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">${course.price}</div>
                {enrollment ? (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Enrolled</span>
                  </div>
                ) : null}
              </div>

              {enrollment ? (
                <button
                  onClick={() => onNavigate('course-learn', course.slug)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {lessons.length} video lessons
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Assignments and quizzes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {course.instructor_name}
              </h3>
              <p className="text-gray-600">{course.instructor_bio}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {lesson.is_free_preview && (
                        <span className="text-green-600 font-medium">Preview</span>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration_minutes}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-20">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
