import React from "react";
import { Calendar, Clock, MapPin, FileText, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api, ENDPOINT } from "@/lib/api"; // Adjust the import path as necessary

const Tests = () => {
  const [test, setTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "midterm":
        return "bg-orange-100 text-orange-800";
      case "final":
        return "bg-red-100 text-red-800";
      case "quiz":
        return "bg-green-100 text-green-800";
      case "practical":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  useEffect(() => {
    const fetchtest = async () => {
      try {
        const response = await api.get(ENDPOINT.tests());
        setTest(response.data);``
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchtest();
  }, [testId]);

  const upcomingTests = test.filter((test) => test.status === "upcoming");
  const completedTests = test.filter((test) => test.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tests</h2>
        <p className="text-gray-600 mt-4">
          Test your knowledge with interactive quizzes
        </p>

        <div className="space-y-4 mt-4">
          {upcomingTests.map((test) => {
            return (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-2 h-2 rounded-full ${test.subject.color}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-600">
                        {test.subject.code}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          test.type
                        )}`}
                      >
                        {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          test.status
                        )}`}
                      >
                        {test.status.charAt(0).toUpperCase() +
                          test.status.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-l font-semibold text-gray-900 mb-3">
                      {test.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {test.date.toLocaleDateString()} at{" "}
                          {test.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration} minutes</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{test.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Max Grade</div>
                    <div className="text-xl font-bold text-gray-900 mb-3">
                      {test.maxGrade}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Tests */}
      {completedTests.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Completed Tests
          </h2>

          <div className="space-y-4">
            {completedTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${test.subject.color}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-600">
                        {test.subject.code}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          test.type
                        )}`}
                      >
                        {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          test.status
                        )}`}
                      >
                        {test.status.charAt(0).toUpperCase() +
                          test.status.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {test.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{test.date.toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{test.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Your Grade</div>
                    <div
                      className={`text-3xl font-bold mb-2 ${
                        test.grade && test.grade / test.maxGrade >= 0.9
                          ? "text-green-600"
                          : test.grade && test.grade / test.maxGrade >= 0.8
                          ? "text-blue-600"
                          : test.grade && test.grade / test.maxGrade >= 0.7
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {test.grade || "N/A"}/{test.maxGrade}
                    </div>

                    {test.grade && (
                      <div
                        className={`text-sm font-medium ${
                          test.grade / test.maxGrade >= 0.9
                            ? "text-green-600"
                            : test.grade / test.maxGrade >= 0.8
                            ? "text-blue-600"
                            : test.grade / test.maxGrade >= 0.7
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {((test.grade / test.maxGrade) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
