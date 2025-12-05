import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CourseLearnPage } from './pages/CourseLearnPage';
import { AssignmentPage } from './pages/AssignmentPage';
import { QuizPage } from './pages/QuizPage';
import { AdminDashboard } from './pages/AdminDashboard';

type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'course-details'
  | 'student-dashboard'
  | 'course-learn'
  | 'assignment'
  | 'quiz'
  | 'admin-dashboard';

function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [assignmentId, setAssignmentId] = useState<string>('');
  const [quizId, setQuizId] = useState<string>('');

  useEffect(() => {
    if (!loading && user && currentPage === 'login') {
      setCurrentPage('home');
    }
  }, [user, loading]);

  function handleNavigate(page: string, param1?: string, param2?: string) {
    setCurrentPage(page as Page);
    if (param1) setCourseSlug(param1);
    if (param2) {
      if (page === 'assignment') setAssignmentId(param2);
      if (page === 'quiz') setQuizId(param2);
    }
    window.scrollTo(0, 0);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const shouldShowNavbar = currentPage !== 'login' && currentPage !== 'signup';

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavbar && <Navbar onNavigate={handleNavigate} currentPage={currentPage} />}

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
      {currentPage === 'course-details' && courseSlug && (
        <CourseDetailsPage courseSlug={courseSlug} onNavigate={handleNavigate} />
      )}
      {currentPage === 'student-dashboard' && user && !isAdmin && (
        <StudentDashboard onNavigate={handleNavigate} />
      )}
      {currentPage === 'course-learn' && courseSlug && user && (
        <CourseLearnPage courseSlug={courseSlug} onNavigate={handleNavigate} />
      )}
      {currentPage === 'assignment' && courseSlug && assignmentId && user && (
        <AssignmentPage
          courseSlug={courseSlug}
          assignmentId={assignmentId}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'quiz' && courseSlug && quizId && user && (
        <QuizPage courseSlug={courseSlug} quizId={quizId} onNavigate={handleNavigate} />
      )}
      {currentPage === 'admin-dashboard' && user && isAdmin && (
        <AdminDashboard onNavigate={handleNavigate} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
