import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Link as LinkIcon, Send, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Assignment, AssignmentSubmission } from '../types';

interface AssignmentPageProps {
  courseSlug: string;
  assignmentId: string;
  onNavigate: (page: string, param?: string) => void;
}

export function AssignmentPage({ courseSlug, assignmentId, onNavigate }: AssignmentPageProps) {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  async function fetchAssignment() {
    setLoading(true);

    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .maybeSingle();

    if (assignmentData) {
      setAssignment(assignmentData);

      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (submissionData) {
        setSubmission(submissionData);
        setSubmissionText(submissionData.submission_text || '');
        setSubmissionUrl(submissionData.submission_url || '');
      }
    }

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!submissionText && !submissionUrl) {
      alert('Please provide either text or a link to your submission');
      return;
    }

    setSubmitting(true);

    const submissionData = {
      assignment_id: assignmentId,
      user_id: user!.id,
      submission_text: submissionText || null,
      submission_url: submissionUrl || null,
    };

    const { error } = await supabase.from('assignment_submissions').upsert(submissionData);

    if (error) {
      alert('Failed to submit assignment: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('course-learn', courseSlug);
      }, 2000);
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Assignment not found</p>
          <button
            onClick={() => onNavigate('course-learn', courseSlug)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Submitted!</h2>
          <p className="text-gray-600">Your instructor will review it soon.</p>
        </div>
      </div>
    );
  }

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
  const isSubmitted = submission !== null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('course-learn', courseSlug)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Course
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Assignment</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{assignment.title}</h2>
            {assignment.due_date && (
              <div className="flex items-center text-blue-100">
                <Clock className="h-5 w-5 mr-2" />
                <span>
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                  {isOverdue && <span className="ml-2 text-red-300">(Overdue)</span>}
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instructions</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Maximum Score</h4>
                  <p className="text-gray-700">{assignment.max_score} points</p>
                </div>
              </div>
            </div>

            {isSubmitted && submission.reviewed_at && (
              <div
                className={`mb-8 p-4 rounded-lg ${
                  submission.score !== null && submission.score >= assignment.max_score * 0.7
                    ? 'bg-green-50'
                    : 'bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Your Score</h3>
                  <span className="text-2xl font-bold text-blue-600">
                    {submission.score} / {assignment.max_score}
                  </span>
                </div>
                {submission.feedback && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Instructor Feedback:</h4>
                    <p className="text-gray-700">{submission.feedback}</p>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isSubmitted ? 'Update Your Submission' : 'Submit Your Work'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Submission
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Type your answer here..."
                    disabled={submission?.reviewed_at !== null}
                  />
                </div>

                <div className="text-center text-gray-500">OR</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="inline h-4 w-4 mr-1" />
                    Submission URL (Google Drive, GitHub, etc.)
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://..."
                    disabled={submission?.reviewed_at !== null}
                  />
                </div>

                {submission?.reviewed_at ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                      This assignment has been reviewed. You cannot update your submission.
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || (!submissionText && !submissionUrl)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {submitting
                      ? 'Submitting...'
                      : isSubmitted
                      ? 'Update Submission'
                      : 'Submit Assignment'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
