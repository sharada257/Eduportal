"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Award, BarChart3, Calendar } from "lucide-react";
import { api, ENDPOINT } from "@/lib/api";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get(ENDPOINT.grades);
        console.log("Grades API Response:", response.data); // DEBUG
        const data = response.data;
        setGrades(Array.isArray(data) ? data : data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch grades:", error);
        setGrades([]); // fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);


  const getGradeColor = (percentage) => {
    if (percentage === null) return "text-gray-500";
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (percentage) => {
    if (percentage === null) return "-";
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading grades...</p>
      </div>
    );
  }

  const overallStats = grades.length > 0
    ? {
      totalGrades: grades.length,
      averageGrade: grades.reduce(
        (sum, grade) => sum + (grade.percentage ?? 0),
        0
      ) / grades.filter(g => g.percentage !== null).length || 1,
      highestGrade: Math.max(
        ...grades.map((g) => g.percentage ?? 0)
      ),
      lowestGrade: Math.min(
        ...grades.map((g) => g.percentage ?? 0)
      ),
    }
    : { totalGrades: 0, averageGrade: 0, highestGrade: 0, lowestGrade: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Grades & Submissions</h2>
        <p className="text-gray-600 mt-2">Track your performance and submissions for assignments, quizzes, and tests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {overallStats.averageGrade.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Grade</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {overallStats.highestGrade.toFixed(1)}%
              </p>
            </div>
            <Award className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lowest Grade</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {overallStats.lowestGrade.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {overallStats.totalGrades}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade History</h2>
        <div className="space-y-4">
          {grades?.map((grade) => {
            const percentage = grade.percentage;
            const letterGrade = getGradeLetter(percentage);
            const submissionDate = new Date(grade.submitted_at).toLocaleDateString();
            const title = grade.quiz_title || grade.assignment_title || grade.test_title || "-";
            const typeBadge = grade.type === "QUIZ" ? "bg-green-100 text-green-800" :
              grade.type === "ASSIGNMENT" ? "bg-blue-100 text-blue-800" :
                grade.type === "TEST" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800";

            return (
              <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeBadge}`}>
                      {grade.type}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {grade.subject_code} - {grade.subject_name}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">Submitted on: {submissionDate}</p>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {grade.obtained_marks !== null ? `${grade.obtained_marks}/${grade.total_marks}` : "-"}
                    </div>
                    <div className="text-sm text-gray-500">Marks</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                      {percentage !== null ? `${percentage.toFixed(1)}%` : "Pending"}
                    </div>
                    <div className="text-sm text-gray-500">Percentage</div>
                  </div>
                  <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${letterGrade === "A" ? "bg-green-100 text-green-800" :
                      letterGrade === "B" ? "bg-blue-100 text-blue-800" :
                        letterGrade === "C" ? "bg-yellow-100 text-yellow-800" :
                          letterGrade === "-" ? "bg-gray-100 text-gray-800" :
                            "bg-red-100 text-red-800"
                    }`}>
                    {letterGrade}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grades;