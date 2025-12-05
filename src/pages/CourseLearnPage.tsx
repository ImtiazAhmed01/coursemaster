import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  FileText,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Course, Lesson, LessonProgress, Assignment, Quiz } from '../types';

interface CourseLearnPageProps {
  courseSlug: string;
  onNavigate: (page: string, param?: string, param2?: string) => void;
}

export function CourseLearnPage({ courseSlug, onNavigate }: CourseLearnPageProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseSlug]);

  async function fetchCourseData() {
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

      if (lessonsData) {
        setLessons(lessonsData);
        setCurrentLesson(lessonsData[0]);
      }

      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in(
          'lesson_id',
          lessonsData?.map((l) => l.id) || []
        );

      if (progressData) {
        const progressMap: Record<string, LessonProgress> = {};
        progressData.forEach((p) => {
          progressMap[p.lesson_id] = p;
        });
        setProgress(progressMap);
      }

      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseData.id);

      if (assignmentsData) setAssignments(assignmentsData);

      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseData.id);

      if (quizzesData) setQuizzes(quizzesData);
    }

    setLoading(false);
  }

  async function toggleLessonComplete(lesson: Lesson) {
    const isCurrentlyComplete = progress[lesson.id]?.completed || false;

    if (isCurrentlyComplete) {
      const { error } = await supabase
        .from('lesson_progress')
        .update({ completed: false, completed_at: null })
        .eq('user_id', user!.id)
        .eq('lesson_id', lesson.id);

      if (!error) {
        setProgress((prev) => ({
          ...prev,
          [lesson.id]: { ...prev[lesson.id], completed: false, completed_at: null },
        }));
      }
    } else {
      const { error } = await supabase.from('lesson_progress').upsert({
        user_id: user!.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });

      if (!error) {
        setProgress((prev) => ({
          ...prev,
          [lesson.id]: {
            ...prev[lesson.id],
            id: prev[lesson.id]?.id || '',
            user_id: user!.id,
            lesson_id: lesson.id,
            completed: true,
            completed_at: new Date().toISOString(),
            watch_time_seconds: prev[lesson.id]?.watch_time_seconds || 0,
          },
        }));
      }
    }
  }

  const completedLessons = lessons.filter((l) => progress[l.id]?.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  const getLessonAssignment = (lessonId: string) => {
    return assignments.find((a) => a.lesson_id === lessonId);
  };

  const getLessonQuiz = (lessonId: string) => {
    return quizzes.find((q) => q.lesson_id === lessonId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found or no lessons available</p>
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => onNavigate('student-dashboard')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-md mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {completedLessons} of {lessons.length} lessons completed
            </p>
            <span className="text-lg font-semibold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src={currentLesson.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentLesson.title}
                ></iframe>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-gray-600 mb-4">{currentLesson.description}</p>
                )}

                <button
                  onClick={() => toggleLessonComplete(currentLesson)}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                    progress[currentLesson.id]?.completed
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {progress[currentLesson.id]?.completed
                    ? 'Lesson Completed'
                    : 'Mark as Complete'}
                </button>
              </div>
            </div>

            {getLessonAssignment(currentLesson.id) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold">Assignment</h3>
                  </div>
                  <button
                    onClick={() =>
                      onNavigate(
                        'assignment',
                        course.slug,
                        getLessonAssignment(currentLesson.id)!.id
                      )
                    }
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View Assignment
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <p className="text-gray-600">
                  {getLessonAssignment(currentLesson.id)!.title}
                </p>
              </div>
            )}

            {getLessonQuiz(currentLesson.id) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <HelpCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold">Quiz</h3>
                  </div>
                  <button
                    onClick={() =>
                      onNavigate('quiz', course.slug, getLessonQuiz(currentLesson.id)!.id)
                    }
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    Take Quiz
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <p className="text-gray-600">{getLessonQuiz(currentLesson.id)!.title}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Course Content</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentLesson.id === lesson.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {progress[lesson.id]?.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {lesson.duration_minutes} minutes
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
