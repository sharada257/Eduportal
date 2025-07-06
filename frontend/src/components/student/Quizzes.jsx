"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Users, Award, Lock } from "lucide-react";
import { api, ENDPOINT } from "@/lib/api";
import Link from "next/link";

const Quizzes = () => {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(ENDPOINT.quizzes);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Quizzes</h2>
        <p className="text-gray-600 mt-2">
          Test your knowledge with interactive quizzes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => router.push(`/quizzes/${quiz.id}`)}
            className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {quiz.subject_name} ({quiz.subject_code})
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${quiz.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {quiz.is_active ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Locked
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-sm text-gray-500">Section</div>
                  <div className="font-semibold text-gray-900">
                    {quiz.section_name}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-500">Total Marks</div>
                  <div className="font-semibold text-gray-900">
                    {quiz.total_marks}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Teacher</span>
                  <span className="font-medium text-gray-800">{quiz.teacher_name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Created At</span>
                  <span className="font-medium">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                {quiz.is_active ? (

                  <Link href={`/quizzes/${quiz.id}`} key={quiz.id}>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Start Quiz
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-medium"
                  >
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
