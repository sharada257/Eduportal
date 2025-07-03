import React, { useState } from 'react';
import { StickyNote, ExternalLink, Download, Calendar, User, FileText, File, Image, Presentation, ArrowLeft, BookOpen, Globe, FolderOpen, Bell, ChevronRight } from 'lucide-react';
import { subjectResources, notes } from '../../data/mockData';

const Notes = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [downloadedNotes, setDownloadedNotes] = useState(new Set());

  const handleDownload = (noteId, fileName) => {
    setDownloadedNotes(prev => new Set([...prev, noteId]));
    console.log(`Downloading: ${fileName}`);
  };

  const handleExternalLink = (url, platform) => {
    console.log(`Opening ${platform}: ${url}`);
    // In a real app, this would open the external link
    window.open(url, '_blank');
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc': return <File className="w-5 h-5 text-blue-500" />;
      case 'ppt': return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'image': return <Image className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'tutorial': return 'bg-green-100 text-green-800';
      case 'reference': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Subject Detail View
  if (selectedSubject) {
    const resource = subjectResources.find(r => r.id === selectedSubject);
    if (!resource) return null;

    const subjectNotes = notes.filter(note => note.subject.id === selectedSubject);

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Subjects
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${resource.subject.color} rounded-xl flex items-center justify-center`}>
              <BookOpen className="w-8 h-8 text-gray-800" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{resource.subject.name}</h1>
              <p className="text-gray-600">{resource.subject.code} • Instructor: {resource.subject.instructor}</p>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Google Classroom */}
          {resource.classroomUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Classroom</h3>
                  <p className="text-sm text-gray-600">Access assignments & discussions</p>
                </div>
              </div>
              <button
                onClick={() => handleExternalLink(resource.classroomUrl, 'Google Classroom')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-gray-800 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Classroom
              </button>
            </div>
          )}

          {/* Google Drive */}
          {resource.driveUrl && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Drive</h3>
                  <p className="text-sm text-gray-600">Course materials & resources</p>
                </div>
              </div>
              <button
                onClick={() => handleExternalLink(resource.driveUrl, 'Google Drive')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-gray-800 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Drive
              </button>
            </div>
          )}

          {/* Course Syllabus */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Course Syllabus</h3>
                <p className="text-sm text-gray-600">Course outline & schedule</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload('syllabus-' + resource.id, `${resource.subject.code}_Syllabus.pdf`)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 text-gray-800 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Syllabus
            </button>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{resource.totalNotes}</div>
              <div className="text-sm text-gray-500">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{resource.announcements}</div>
              <div className="text-sm text-gray-500">Announcements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {subjectNotes.filter(n => n.category === 'lecture').length}
              </div>
              <div className="text-sm text-gray-500">Lecture Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {subjectNotes.filter(n => n.category === 'assignment').length}
              </div>
              <div className="text-sm text-gray-500">Resources</div>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Study Materials</h3>
          
          {subjectNotes.length === 0 ? (
            <div className="text-center py-12">
              <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No materials yet</h4>
              <p className="text-gray-600">Check back later for course materials and resources.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjectNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {getFileIcon(note.fileType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{note.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </span>
                        {note.week && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                            Week {note.week}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{note.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{note.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{note.uploadedAt.toLocaleDateString()}</span>
                        </div>
                        <span>{note.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(note.id, note.fileName)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      downloadedNotes.has(note.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-gray-800 hover:bg-blue-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {downloadedNotes.has(note.id) ? 'Downloaded' : 'Download'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Subject Grid View
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Study Resources</h1>
        <p className="text-gray-600 mt-2">Access course materials, Google Classroom, and study resources for each subject.</p>
      </div>

      {/* Overall Statistics */}
      <div className="mt-8 mb-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {subjectResources.reduce((sum, r) => sum + r.totalNotes, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Materials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{subjectResources.length}</div>
            <div className="text-sm text-gray-500">Active Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{downloadedNotes.size}</div>
            <div className="text-sm text-gray-500">Downloaded</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {subjectResources.reduce((sum, r) => sum + r.announcements, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Updates</div>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {subjectResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="bg-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-gray-800">
                  <h3 className="text-xl font-semibold">{resource.subject.code}</h3>
                  <p className="text-gray-800/90">{resource.subject.name}</p>
                  <p className="text-gray-800/80 text-sm mt-1">Instructor: {resource.subject.instructor}</p>
                </div>
                <BookOpen className="w-8 h-8 text-gray-800/80" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{resource.totalNotes}</div>
                  <div className="text-xs text-gray-500">Materials</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{resource.announcements}</div>
                  <div className="text-xs text-gray-500">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.floor((Date.now() - resource.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))}d
                  </div>
                  <div className="text-xs text-gray-500">Last Update</div>
                </div>
              </div>

              {/* Recent Materials Preview */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Recent Materials</h4>
                <div className="space-y-2">
                  {resource.recentNotes.slice(0, 2).map((note) => (
                    <div key={note.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {getFileIcon(note.fileType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                        <p className="text-xs text-gray-500">{note.uploadedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {resource.totalNotes > 2 && (
                    <p className="text-xs text-gray-500 text-center py-1">
                      +{resource.totalNotes - 2} more materials
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Access Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedSubject(resource.id)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium">View All Materials</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  {resource.classroomUrl && (
                    <button
                      onClick={() => handleExternalLink(resource.classroomUrl, 'Google Classroom')}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-green-600 text-gray-800 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      Classroom
                    </button>
                  )}
                  
                  {resource.driveUrl && (
                    <button
                      onClick={() => handleExternalLink(resource.driveUrl, 'Google Drive')}
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-gray-800 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Drive
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Notes;