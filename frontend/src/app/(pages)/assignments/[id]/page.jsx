"use client";

import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const AssignmentDetailPage = ({ params }) => {
  const { id } = params;

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

  // Sample assignment question - replace with props in real usage
  const assignmentQuestion = {
    title: "Data Analysis Assignment",
    description: "Analyze the provided dataset and create a comprehensive report including visualizations, statistical analysis, and insights. Your submission should include both the analysis code and a written report explaining your findings.",
    requirements: [
      "Submit your analysis code (Python/R/SQL)",
      "Include a written report (PDF/Word)",
      "Add any additional visualizations or charts",
      "Maximum file size: 10MB per file"
    ],
    dueDate: "March 15, 2024, 11:59 PM"
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  }, []);

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      return file.size <= maxSize;
    });

    const fileObjects = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready'
    }));

    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      setFiles(prev => prev.map(file => ({ ...file, status: 'uploaded' })));
    }, 2000);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('code') || fileType.includes('text')) return '💻';
    return '📎';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Assignment Question Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {assignmentQuestion.title}
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-gray-700 leading-relaxed">
            {assignmentQuestion.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Requirements:</h3>
            <ul className="space-y-1">
              {assignmentQuestion.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-600 text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Due Date:</h3>
            <p className="text-red-600 font-medium">{assignmentQuestion.dueDate}</p>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Files</h2>
        
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            Drag and drop your files here
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to select files
          </p>
          
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Selected Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {file.status === 'uploaded' && (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus === 'uploading' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
              <span className="text-yellow-800">Uploading files...</span>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">Files uploaded successfully!</span>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">Upload failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || uploadStatus === 'uploading'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              files.length === 0 || uploadStatus === 'uploading'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
