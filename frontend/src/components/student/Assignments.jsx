"use client"
import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { assignments } from '../../data/mockData';
import { useEffect} from 'react';
  
const Assignments = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'graded': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };


  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const DueCountdown = (dueDate ) => {
    const [daysLeft, setDaysLeft] = useState(null);

      useEffect(() => {
        const days = getDaysUntilDue(dueDate);
        setDaysLeft(days);
      }, [dueDate]);
      return daysLeft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
        <p className="text-gray-600 mt-2">Test your knowledge with interactive quizzes</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'all', label: 'All Assignments' },
            { key: 'pending', label: 'Pending' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'graded', label: 'Graded' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const daysUntilDue = DueCountdown(assignment.dueDate);
          
          return (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${assignment.subject.color}`}></div>
                    <span className="text-sm font-medium text-gray-500">{assignment.subject.code}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-l font-semibold text-gray-800 mb-2">{assignment.title}</h3>
                  
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                    </div>
                    
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">Max Grade</div>
                  <div className="text-xl font-bold text-gray-800">{assignment.maxGrade}</div>
                  
                  {assignment.grade !== undefined && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">Your Grade</div>
                      <div className={`text-xl font-bold ${
                        (assignment.grade / assignment.maxGrade) >= 0.9 ? 'text-green-600' :
                        (assignment.grade / assignment.maxGrade) >= 0.8 ? 'text-blue-600' :
                        (assignment.grade / assignment.maxGrade) >= 0.7 ? 'text-yellow-600' :
                        'text-red-500'
                      }`}>
                        {assignment.grade}
                      </div>
                    </div>
                  )}
                  
                  {assignment.status === 'pending' && (
                    <button className="mt-4 px-4 py-2 bg-black-500 text-white rounded-lg hover:bg-black transition-colors">
                      Submit Assignment
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assignments;