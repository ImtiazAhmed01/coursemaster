import { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, CheckCircle, XCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Quiz, QuizQuestion, QuizAttempt } from '../types';

interface QuizPageProps {
  courseSlug: string;
  quizId: string;
  onNavigate: (page: string, param?: string) => void;
}

export function QuizPage({ courseSlug, quizId, onNavigate }: QuizPageProps) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; totalPoints: number } | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  async function fetchQuiz() {
    setLoading(true);

    const { data: quizData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .maybeSingle();

    if (quizData) {
      setQuiz(quizData);

      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsData) {
        setQuestions(questionsData);
      }

      const { data: attemptsData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: false });

      if (attemptsData) {
        setPreviousAttempts(attemptsData);
      }
    }

    setLoading(false);
  }

  function handleAnswerChange(questionId: string, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  async function handleSubmit() {
    let score = 0;
    let totalPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      if (answers[question.id] === question.correct_answer) {
        score += question.points;
      }
    });

    const { error } = await supabase.from('quiz_attempts').insert({
      quiz_id: quizId,
      user_id: user!.id,
      score,
      total_points: totalPoints,
      answers,
      completed_at: new Date().toISOString(),
    });

    if (!error) {
      setResult({ score, totalPoints });
      setSubmitted(true);
    } else {
      alert('Failed to submit quiz: ' + error.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quiz not found</p>
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

  const allQuestionsAnswered = questions.every((q) => answers[q.id]);
  const percentage = result ? Math.round((result.score / result.totalPoints) * 100) : 0;
  const passed = result ? percentage >= quiz.passing_score : false;

  if (submitted && result) {
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
            <div
              className={`p-8 text-white ${
                passed
                  ? 'bg-gradient-to-r from-green-600 to-green-800'
                  : 'bg-gradient-to-r from-orange-600 to-orange-800'
              }`}
            >
              <div className="text-center">
                {passed ? (
                  <CheckCircle className="h-20 w-20 mx-auto mb-4" />
                ) : (
                  <Award className="h-20 w-20 mx-auto mb-4" />
                )}
                <h1 className="text-4xl font-bold mb-2">
                  {passed ? 'Congratulations!' : 'Quiz Completed'}
                </h1>
                <p className="text-xl mb-6">
                  {passed
                    ? 'You passed the quiz!'
                    : 'Keep learning and try again to improve your score'}
                </p>
                <div className="text-6xl font-bold mb-2">{percentage}%</div>
                <p className="text-xl">
                  {result.score} out of {result.totalPoints} points
                </p>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correct_answer;

                  return (
                    <div
                      key={question.id}
                      className={`p-6 rounded-lg border-2 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start mb-4">
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Question {index + 1}
                          </h3>
                          <p className="text-gray-700 mb-4">{question.question_text}</p>

                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <div
                                key={option}
                                className={`p-3 rounded-lg ${
                                  option === question.correct_answer
                                    ? 'bg-green-100 border-2 border-green-500'
                                    : option === userAnswer
                                    ? 'bg-red-100 border-2 border-red-500'
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  {option === question.correct_answer && (
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  )}
                                  {option === userAnswer && option !== question.correct_answer && (
                                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                                  )}
                                  <span className="text-gray-900">{option}</span>
                                  {option === question.correct_answer && (
                                    <span className="ml-auto text-sm text-green-600 font-medium">
                                      Correct Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                    setResult(null);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8">
            <div className="flex items-center mb-4">
              <HelpCircle className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Quiz</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-4">{quiz.title}</h2>
            {quiz.description && <p className="text-green-100">{quiz.description}</p>}
            <div className="mt-4 flex items-center space-x-6 text-green-100">
              <span>Passing Score: {quiz.passing_score}%</span>
              {quiz.time_limit_minutes && <span>Time Limit: {quiz.time_limit_minutes} minutes</span>}
            </div>
          </div>

          <div className="p-8">
            {previousAttempts.length > 0 && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Previous Attempts</h3>
                <div className="space-y-2">
                  {previousAttempts.slice(0, 3).map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Attempt {previousAttempts.length - index}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((attempt.score / attempt.total_points) * 100)}% ({attempt.score}
                        /{attempt.total_points} points)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Question {index + 1} ({question.points} points)
                  </h3>
                  <p className="text-gray-700 mb-4">{question.question_text}</p>

                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          answers[question.id] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                          className="mr-3 h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {allQuestionsAnswered
                  ? 'Submit Quiz'
                  : `Answer all questions (${Object.keys(answers).length}/${questions.length} completed)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
