import { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Course, Category } from '../types';

interface AdminDashboardProps {
  onNavigate: (page: string, param?: string) => void;
}

type TabType = 'courses' | 'enrollments' | 'assignments';

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor_name: '',
    instructor_bio: '',
    price: 0,
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category_id: '',
    tags: '',
  });

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'courses') fetchCourses();
    if (activeTab === 'enrollments') fetchEnrollments();
    if (activeTab === 'assignments') fetchAssignments();
  }, [activeTab]);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
    setLoading(false);
  }

  async function fetchEnrollments() {
    setLoading(true);
    const { data } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        user:profiles!enrollments_user_id_fkey(full_name, email),
        course:courses(title)
      `
      )
      .order('enrolled_at', { ascending: false });
    if (data) setEnrollments(data);
    setLoading(false);
  }

  async function fetchAssignments() {
    setLoading(true);
    const { data } = await supabase
      .from('assignment_submissions')
      .select(
        `
        *,
        assignment:assignments(title, max_score, course:courses(title)),
        user:profiles!assignment_submissions_user_id_fkey(full_name, email)
      `
      )
      .order('submitted_at', { ascending: false });
    if (data) setAssignments(data);
    setLoading(false);
  }

  async function handleDeleteCourse(courseId: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (!error) {
      fetchCourses();
    } else {
      alert('Failed to delete course: ' + error.message);
    }
  }

  async function handleSaveCourse() {
    const slug = courseForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const tagsArray = courseForm.tags.split(',').map((t) => t.trim()).filter((t) => t);

    const courseData = {
      ...courseForm,
      slug,
      tags: tagsArray,
      created_by: user!.id,
    };

    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id);

      if (error) {
        alert('Failed to update course: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('courses').insert(courseData);

      if (error) {
        alert('Failed to create course: ' + error.message);
        return;
      }
    }

    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm({
      title: '',
      description: '',
      instructor_name: '',
      instructor_bio: '',
      price: 0,
      level: 'beginner',
      category_id: '',
      tags: '',
    });
    fetchCourses();
  }

  function openEditModal(course: Course) {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor_name: course.instructor_name,
      instructor_bio: course.instructor_bio || '',
      price: course.price,
      level: course.level,
      category_id: course.category_id || '',
      tags: course.tags.join(', '),
    });
    setShowCourseModal(true);
  }

  async function handleReviewAssignment(submissionId: string, score: number, feedback: string) {
    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        score,
        feedback,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user!.id,
      })
      .eq('id', submissionId);

    if (!error) {
      fetchAssignments();
    } else {
      alert('Failed to review assignment: ' + error.message);
    }
  }

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage courses, enrollments, and assignments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'courses'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'enrollments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Enrollments
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'assignments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Assignment Reviews
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        description: '',
                        instructor_name: '',
                        instructor_bio: '',
                        price: 0,
                        level: 'beginner',
                        category_id: '',
                        tags: '',
                      });
                      setShowCourseModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Course
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="font-medium">${course.price}</span>
                              <span className="capitalize">{course.level}</span>
                              <span>{course.instructor_name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => onNavigate('course-details', course.slug)}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openEditModal(course)}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'enrollments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Enrollments</h2>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Enrolled
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.user?.full_name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">{enrollment.user?.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{enrollment.course?.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 mr-2">
                                  {enrollment.progress_percentage}%
                                </span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${enrollment.progress_percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  enrollment.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : enrollment.status === 'active'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(enrollment.enrolled_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assignment Submissions</h2>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((submission) => (
                      <div
                        key={submission.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {submission.assignment?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Course: {submission.assignment?.course?.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Student: {submission.user?.full_name} ({submission.user?.email})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                            {submission.reviewed_at && (
                              <p className="text-sm font-medium text-green-600">Reviewed</p>
                            )}
                          </div>
                        </div>

                        {submission.submission_text && (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {submission.submission_text}
                            </p>
                          </div>
                        )}

                        {submission.submission_url && (
                          <div className="mb-4">
                            <a
                              href={submission.submission_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              View Submission Link
                            </a>
                          </div>
                        )}

                        {submission.reviewed_at ? (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Score:</span>
                              <span className="text-lg font-bold text-green-600">
                                {submission.score} / {submission.assignment?.max_score}
                              </span>
                            </div>
                            {submission.feedback && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Feedback:</span>
                                <p className="text-sm text-gray-700 mt-1">{submission.feedback}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              handleReviewAssignment(
                                submission.id,
                                Number(formData.get('score')),
                                formData.get('feedback') as string
                              );
                            }}
                            className="space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Score (out of {submission.assignment?.max_score})
                                </label>
                                <input
                                  type="number"
                                  name="score"
                                  min="0"
                                  max={submission.assignment?.max_score}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback
                              </label>
                              <textarea
                                name="feedback"
                                rows={3}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              Submit Review
                            </button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.instructor_name}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, instructor_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={courseForm.price}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Bio
                </label>
                <textarea
                  value={courseForm.instructor_bio}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, instructor_bio: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={courseForm.category_id}
                    onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={courseForm.tags}
                  onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                  placeholder="react, javascript, frontend"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSaveCourse}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              <button
                onClick={() => {
                  setShowCourseModal(false);
                  setEditingCourse(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
