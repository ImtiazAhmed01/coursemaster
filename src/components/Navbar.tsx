import { useState } from 'react';
import { BookOpen, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CourseMaster</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Courses
            </button>

            {user ? (
              <>
                {isAdmin ? (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      currentPage === 'admin-dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('student-dashboard')}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      currentPage === 'student-dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>My Courses</span>
                  </button>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {profile?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Courses
            </button>

            {user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(isAdmin ? 'admin-dashboard' : 'student-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {isAdmin ? 'Admin Dashboard' : 'My Courses'}
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
