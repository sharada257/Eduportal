"use client";
import React, { useEffect } from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import useAssignmentStore from "@/stores/useAssignmentStore";

const Assignments = () => {
  const { assignments, loading, error, getAllAssignments } = useAssignmentStore();

  useEffect(() => {
    if (assignments.length === 0) {
      getAllAssignments();
    }
  }, [getAllAssignments, assignments.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">
          {typeof error === "string" ? error : "Failed to load assignments. Please try again later."}
        </p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">No assignments found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
        <p className="text-gray-600 mt-2">Check your upcoming assignments and deadlines</p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Link href={`/assignments/${assignment.id}`} key={assignment.id}>
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {assignment.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>
                        {assignment.subject_name} ({assignment.subject_code})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Section: {assignment.section_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Teacher: {assignment.teacher_name}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {assignment.is_overdue ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Overdue</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">On Time</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{assignment.days_remaining} days remaining</span>
                    </div>
                  </div>
                </div>

                {assignment.is_active && (
                  <div className="text-right">
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Submit Assignment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
