'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore, useSkillStore, useQuizStore } from '@/lib/store';
import { quizAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { extractedSkills } = useSkillStore();
  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (!user || user.role !== 'student') {
    router.push('/login');
    return null;
  }

  const startQuiz = async () => {
    if (!extractedSkills || extractedSkills.skills.length === 0) {
      alert('Please upload your resume first to extract skills');
      router.push('/dashboard/student/upload');
      return;
    }

    setLoading(true);
    try {
      const quiz = await quizAPI.generateQuiz(extractedSkills.skills);
      setQuizData(quiz);
      setQuizStarted(true);
    } catch (err) {
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    quizData.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / quizData.length) * 100;
    setResults({
      score,
      total: quizData.length,
      percentage: Math.round(percentage),
    });
  };

  if (results) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar role="student" />

        <div className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-8xl mb-6">
              {results.percentage >= 80 ? '🎉' : results.percentage >= 60 ? '👍' : '💪'}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">Quiz Completed!</h1>

            <div className="p-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl mb-8">
              <div className="text-6xl font-bold text-white mb-2">{results.percentage}%</div>
              <div className="text-2xl text-gray-300 mb-4">
                {results.score} out of {results.total} correct
              </div>

              <div className="space-y-2 text-gray-300">
                {results.percentage >= 80 && <p>Outstanding! You have excellent knowledge of these skills.</p>}
                {results.percentage >= 60 && results.percentage < 80 && <p>Good job! You have solid understanding.</p>}
                {results.percentage < 60 && <p>Keep practicing! You'll improve with more effort.</p>}
              </div>
            </div>

            <motion.button
              onClick={() => {
                setResults(null);
                setQuizStarted(false);
                setCurrentQuestionIndex(0);
                setAnswers({});
              }}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg mr-4"
            >
              Retake Quiz
            </motion.button>

            <motion.button
              onClick={() => router.push('/dashboard/student/jobs')}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg"
            >
              View Job Matches
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar role="student" />

        <div className="flex-1 ml-64 p-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Skill Assessment Quiz</h1>
            <p className="text-gray-400 mb-12">Test your knowledge based on your extracted skills</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl text-center"
            >
              <div className="text-6xl mb-6">✏️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Test Your Skills?</h2>
              <p className="text-gray-300 mb-8">
                Answer 5 questions about your extracted skills and get instant feedback.
              </p>

              <motion.button
                onClick={startQuiz}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? 'Generating Quiz...' : 'Start Quiz'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizData.length === 0) {
    return null;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Skill Assessment Quiz</h1>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-gray-300 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {quizData.length}
              </span>
              <span>
                {Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="max-w-3xl mx-auto p-8 bg-gray-800/50 border border-gray-700 rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, i: number) => (
                <motion.button
                  key={i}
                  onClick={() => handleAnswerSelect(option)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-purple-600 bg-purple-600/20 text-white'
                      : 'border-gray-600 bg-gray-700/20 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-600'
                      }`}
                    >
                      {selectedAnswer === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <motion.button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 border-2 border-gray-600 text-white rounded-lg disabled:opacity-30"
            >
              ← Previous
            </motion.button>

            {currentQuestionIndex === quizData.length - 1 ? (
              <motion.button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quizData.length}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg disabled:opacity-30"
              >
                Submit Quiz
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
              >
                Next →
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
