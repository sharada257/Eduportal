'use client';
import { useEffect, useState } from "react";
import { api, ENDPOINT } from "@/lib/api";  // Update this import path if needed

export default function TestDetailPage({params}) {
  const id = params.id;  // grabs test ID from URL

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // wait until router provides the id

    const fetchTestDetails = async () => {
      try {
        const response = await api.get(ENDPOINT.test(id));
        setTest(response.data);
      } catch (error) {
        console.error("Failed to fetch test details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  if (loading) return <div className="p-6">Loading test details...</div>;
  if (!test) return <div className="p-6 text-red-600">Test not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{test.title}</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Subject:</strong> {test.subject_name} ({test.subject_code})
        </p>
        <p>
          <strong>Teacher:</strong> {test.teacher_name}
        </p>
        <p>
          <strong>Section:</strong> {test.section_name}
        </p>
        <p>
          <strong>Scheduled Date:</strong>{" "}
          {new Date(test.scheduled_date).toLocaleString()}
        </p>
        <p>
          <strong>Total Marks:</strong> {test.total_marks}
        </p>
        <p>
          <strong>Test Status:</strong>{" "}
          {test.is_upcoming ? "Upcoming" : "Completed"}
        </p>
      </div>
    </div>
  );
}
