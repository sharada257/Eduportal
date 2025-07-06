import React from "react";

const AssignmentDetailPage = ({ params }) => {
  const { id } = params;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Assignment Detail</h1>
      <p className="text-lg text-gray-700">
        This is a dummy assignment page for ID: <span className="font-mono text-blue-600">{id}</span>
      </p>
      <p className="mt-4 text-gray-500">
        Replace this with your assignment details component later.
      </p>
    </div>
  );
};

export default AssignmentDetailPage;
