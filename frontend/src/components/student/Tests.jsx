"use client";
import React, { useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import useTestStore from "@/stores/useTestsStore"; // adjust path if needed
import { Card, CardContent } from "@/components/ui/card";
import {Progress} from "@/components/ui/progress"; // optional: your existing loader component

const Tests = () => {
  const { tests, loading, error, getAllTests } = useTestStore();

  // Fetch tests on component mount
  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  // Filter upcoming tests based on your `is_upcoming` field
  const upcomingTests = tests.filter((t) => t.is_upcoming);

  const StatCard = ({ title, value, icon }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <Progress />; // show loader while fetching

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Failed to load tests: {error.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Upcoming Tests</h2>
        <p className="text-gray-600 mt-2">Track your scheduled tests here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Upcoming Tests"
          value={upcomingTests.length.toString()}
          icon={<Calendar className="w-6 h-6 text-red-500" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Upcoming Test Details
          </h2>
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>

        {upcomingTests.length === 0 ? (
          <p className="text-gray-600">No upcoming tests scheduled.</p>
        ) : (
          <div className="space-y-4">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{test.title}</h3>
                  <p className="text-sm text-gray-700">{test.subject_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Scheduled:{" "}
                    {new Date(test.scheduled_date).toLocaleString()}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Test
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;
