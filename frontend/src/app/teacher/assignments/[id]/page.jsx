"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, FileText, UploadCloud } from "lucide-react";
import { api, ENDPOINT } from "@/lib/api";
import useAuthStore from "@/stores/authStore";

const AssignmentDetailPage = () => {
    const {id} = useParams();
    const [assignment, setAssignment] = useState(null);
    const [url, setUrl] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const { user: profile } = useAuthStore();
    const [submission, setSubmission] = useState(false);
    const studentId = profile?.student_id || "";
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await api.get(ENDPOINT.assignment(id));
                setAssignment(response.data);
            } catch (error) {
                console.error("Failed to fetch assignment", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAssignment();
    }, [id]);

    const handleSubmit = async () => {
        if (!url.trim() || !assignment) {
            setSubmitStatus("Missing required fields.");
            return;
        }

        try {
            setSubmitStatus("Submitting...");

            const res = await api.post(ENDPOINT.submissions, {
                assignment: assignment.id,
                student: studentId,
                type: "assignment",
                file_url: url.trim(),
                is_evaluated: false,
            });

            if (res.status == 200 || res.status == 201) {
                setSubmitStatus("Submission successful!");
                setUrl("");
                setSubmission(true);
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus("Submission failed. Try again.");
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading assignment...</div>;
    if (!assignment) return <div className="p-6 text-red-500">Assignment not found.</div>;

    return (
        <div className="p-6 space-y-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{assignment.title}</h2>
            <p className="text-gray-700">{assignment.description}</p>

            <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {assignment.subject_name} ({assignment.subject_code})
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Teacher: {assignment.teacher_name || "N/A"}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(assignment.due_date).toLocaleString()}
                </div>
                <div className="text-sm">
                    Status:{" "}
                    {assignment.is_overdue ? (
                        <span className="text-red-600 font-medium">Overdue</span>
                    ) : (
                        <span className="text-green-600 font-medium">On Time</span>
                    )}
                </div>
            </div>

            {assignment.is_active && (
                <div className="space-y-4">
                    {!submission ? (
                        <>
                    <label className="block">
                        <span className="block mb-1 text-sm font-medium text-gray-700">Upload your assignment:</span>
                        <input
                            type="text"
                            placeholder="Paste assignment file URL (Google Drive, Dropbox...)"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                    </label>

                    <button
                        disabled={!url.trim()}
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-md transition-colors text-white 
                        ${!url.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
                    >
                        Submit Assignment
                    </button>
                    </>
                    ):(
                        <div className="text-green-600 font-semibold">Assignment submitted successfully!</div>
                    )
                    }
                    {submitStatus && <p className="text-sm text-gray-600">{submitStatus}</p>}
                </div>
            )}

            {!assignment.is_active && (
                <div className="text-red-600 font-semibold">This assignment is no longer active for submission.</div>
            )}
        </div>
    );
};

export default AssignmentDetailPage;
