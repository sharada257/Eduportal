import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { api, ENDPOINT } from "@/lib/api";
import Link from "next/link";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (isUpcoming) => {
    return isUpcoming
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get(ENDPOINT.tests);
        setTests(response.data);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const upcomingTests = tests.filter((t) => t.is_upcoming);
  const completedTests = tests.filter((t) => !t.is_upcoming);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (loading) return <div>Loading tests...</div>;

  return (
    <div className="space-y-8">
      {/* Upcoming Tests */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900">Upcoming Tests</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Prepare for your upcoming assessments.
        </p>

        {upcomingTests.length === 0 && (
          <p className="text-gray-500">No upcoming tests scheduled.</p>
        )}

        <div className="space-y-4">
          {upcomingTests.map((test) => (
            <Link key={test.id} href = {`/tests/${test.id}`}>
              <div 
              className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      {test.subject_code}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-sm text-gray-600">
                      {test.subject_name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        test.is_upcoming
                      )}`}
                    >
                      {test.is_upcoming ? "Upcoming" : "Completed"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {test.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(test.scheduled_date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{test.section_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{test.teacher_name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Total Marks</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {test.total_marks}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {test.days_until_test === 0
                      ? "Today"
                      : `${test.days_until_test} day(s) left`}
                  </div>
                </div>
              </div>
              </div>  
            </Link>
          ))}
        </div>
      </section>

      {/* Completed Tests */}
      {completedTests.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Completed Tests
          </h2>

          <div className="space-y-4">
            {completedTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        {test.subject_code}
                      </span>
                      <span className="text-gray-500">|</span>
                      <span className="text-sm text-gray-600">
                        {test.subject_name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          test.is_upcoming
                        )}`}
                      >
                        Completed
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {test.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(test.scheduled_date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{test.section_name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{test.teacher_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Total Marks</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {test.total_marks}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Tests;
