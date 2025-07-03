import React, { useState } from 'react';
import { TrendingUp, Award, BarChart3, Calendar } from 'lucide-react';
import { grades, subjects, student } from '../../data/mockData';

const Grades = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  const filteredGrades = selectedSubject === 'all' 
    ? grades 
    : grades.filter(grade => grade.subject.id === selectedSubject);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const calculateSubjectGPA = (subjectId) => {
    const subjectGrades = grades.filter(g => g.subject.id === subjectId);
    if (subjectGrades.length === 0) return 0;
    
    const totalPoints = subjectGrades.reduce((sum, grade) => {
      const percentage = (grade.grade / grade.maxGrade) * 100;
      const points = percentage >= 90 ? 4.0 : 
                    percentage >= 80 ? 3.0 : 
                    percentage >= 70 ? 2.0 : 
                    percentage >= 60 ? 1.0 : 0.0;
      return sum + points;
    }, 0);
    
    return totalPoints / subjectGrades.length;
  };

  const overallStats = {
    totalGrades: grades.length,
    averageGrade: grades.reduce((sum, grade) => sum + (grade.grade / grade.maxGrade) * 100, 0) / grades.length,
    highestGrade: Math.max(...grades.map(grade => (grade.grade / grade.maxGrade) * 100)),
    lowestGrade: Math.min(...grades.map(grade => (grade.grade / grade.maxGrade) * 100))
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Grades</h2>
          <p className="text-gray-600 mt-2">Track your academic performance and progress.</p>
        </div>
    

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current GPA</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{student.gpa}</p>
            </div>
            <div className="p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.averageGrade.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Grade</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{overallStats.highestGrade.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Grades</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overallStats.totalGrades}</p>
            </div>
            <div className="p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Performance</h2>
          
          <div className="space-y-4">
            {subjects.map((subject) => {
              const subjectGrades = grades.filter(g => g.subject.id === subject.id);
              const avgGrade = subjectGrades.length > 0 
                ? subjectGrades.reduce((sum, grade) => sum + (grade.grade / grade.maxGrade) * 100, 0) / subjectGrades.length
                : 0;
              const gpa = calculateSubjectGPA(subject.id);
              
              return (
                <div key={subject.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900">{subject.code}</h3>
                        <p className="text-sm text-gray-600">{subject.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getGradeColor(avgGrade)}`}>
                        {avgGrade > 0 ? `${avgGrade.toFixed(1)}%` : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        GPA: {gpa.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {avgGrade > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          avgGrade >= 90 ? 'bg-green-500' :
                          avgGrade >= 80 ? 'bg-blue-500' :
                          avgGrade >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(avgGrade, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grades List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-l font-semibold text-gray-900">Grade History</h2>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            {filteredGrades.map((grade) => {
              const percentage = (grade.grade / grade.maxGrade) * 100;
              const letterGrade = getGradeLetter(percentage);
              
              return (
                <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${grade.subject.color}`}></div>
                      <span className="text-sm font-medium text-gray-600">{grade.subject.code}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        grade.type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                        grade.type === 'quiz' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {grade.type.charAt(0).toUpperCase() + grade.type.slice(1)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">{grade.title}</h3>
                    <p className="text-sm text-gray-500">{grade.date.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {grade.grade}/{grade.maxGrade}
                        </div>
                        <div className="text-sm text-gray-500">Points</div>
                      </div>
                      
                      <div>
                        <div className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Percentage</div>
                      </div>
                      
                      <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                        letterGrade === 'A' ? 'bg-green-100 text-green-800' :
                        letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        letterGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {letterGrade}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;