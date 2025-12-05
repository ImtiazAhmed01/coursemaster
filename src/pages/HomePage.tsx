import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, DollarSign, Clock, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course, Category } from '../types';

interface HomePageProps {
  onNavigate: (page: string, courseSlug?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'price-low' | 'price-high'>('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 6;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, currentPage]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  }

  async function fetchCourses() {
    setLoading(true);

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('is_published', true);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,instructor_name.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);
    }

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (selectedLevel !== 'all') {
      query = query.eq('level', selectedLevel);
    }

    if (sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('title', { ascending: true });
    }

    const from = (currentPage - 1) * coursesPerPage;
    const to = from + coursesPerPage - 1;
    query = query.range(from, to);

    const { data, count } = await query;

    if (data) {
      setCourses(data);
      setTotalCourses(count || 0);
    }

    setLoading(false);
  }

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Without Limits</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover thousands of courses from expert instructors
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by title, instructor, or topic..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="title">Sort by Title</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {courses.length} of {totalCourses} courses
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No courses found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => onNavigate('course-details', course.slug)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-6xl text-white opacity-20">📚</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                      <span className="text-xl font-bold text-blue-600">${course.price}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="font-medium">{course.instructor_name}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
