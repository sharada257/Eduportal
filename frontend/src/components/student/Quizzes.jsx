import React from 'react';
import { Clock, Users, Award, Play, CheckCircle, Lock } from 'lucide-react';
import { quizzes } from '../../data/mockData';

const Quizzes = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quizzes</h2>
          <p className="text-gray-600 mt-2">Test your knowledge with interactive quizzes</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className={`${quiz.subject.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="text-gray-800">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-gray-800/90 text-sm">{quiz.subject.name}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(quiz.status)}`}>
                  {getStatusIcon(quiz.status)}
                  {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-500">Questions</div>
                  <div className="font-semibold text-gray-900">{quiz.questions}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-semibold text-gray-900">{quiz.duration} min</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attempts</span>
                  <span className="font-medium">{quiz.attempts}/{quiz.maxAttempts}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="font-medium">{quiz.dueDate.toLocaleDateString()}</span>
                </div>
                
                {quiz.bestScore && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Best Score</span>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">{quiz.bestScore}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {quiz.status === 'available' && (
                  <button className="w-full bg-blue-600 text-gray-800 py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Start Quiz
                  </button>
                )}
                
                {quiz.status === 'completed' && quiz.attempts < quiz.maxAttempts && (
                  <button className="w-full bg-green-600 text-gray-800 py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Retake Quiz
                  </button>
                )}
                
                {quiz.status === 'completed' && quiz.attempts >= quiz.maxAttempts && (
                  <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed font-medium">
                    No More Attempts
                  </button>
                )}
                
                {quiz.status === 'locked' && (
                  <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed font-medium">
                    Quiz Locked
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;