export const subjects= [
  {
    id: '1',
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    color: 'bg-blue-500',
    instructor: 'Dr. Smith',
    classroomUrl: 'https://classroom.google.com/c/cs101-fundamentals',
    driveUrl: 'https://drive.google.com/drive/folders/cs101-resources'
  },
  {
    id: '2',
    name: 'Mathematics for Engineers',
    code: 'MATH201',
    color: 'bg-green-500',
    instructor: 'Prof. Johnson',
    classroomUrl: 'https://classroom.google.com/c/math201-engineers',
    driveUrl: 'https://drive.google.com/drive/folders/math201-resources'
  },
  {
    id: '3',
    name: 'Database Systems',
    code: 'CS301',
    color: 'bg-purple-500',
    instructor: 'Dr. Williams',
    classroomUrl: 'https://classroom.google.com/c/cs301-database',
    driveUrl: 'https://drive.google.com/drive/folders/cs301-resources'
  },
  {
    id: '4',
    name: 'Software Engineering',
    code: 'CS401',
    color: 'bg-orange-500',
    instructor: 'Prof. Brown',
    classroomUrl: 'https://classroom.google.com/c/cs401-software-eng',
    driveUrl: 'https://drive.google.com/drive/folders/cs401-resources'
  }
];

export const student= {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  studentId: 'ST2024001',
  program: 'Computer Science',
  year: 3,
  semester: 1,
  gpa: 3.75
};

export const assignments = [
  {
    id: '1',
    title: 'Data Structures Implementation',
    subject: subjects[0],
    description: 'Implement basic data structures including linked lists, stacks, and queues',
    dueDate: new Date('2024-02-15'),
    status: 'pending',
    maxGrade: 100
  },
  {
    id: '2',
    title: 'Calculus Problem Set 3',
    subject: subjects[1],
    description: 'Solve integration and differentiation problems',
    dueDate: new Date('2024-02-10'),
    status: 'submitted',
    maxGrade: 50,
    submittedAt: new Date('2024-02-08')
  },
  {
    id: '3',
    title: 'Database Design Project',
    subject: subjects[2],
    description: 'Design and implement a database for a library management system',
    dueDate: new Date('2024-02-20'),
    status: 'pending',
    maxGrade: 150
  },
  {
    id: '4',
    title: 'Software Requirements Document',
    subject: subjects[3],
    description: 'Create a comprehensive requirements document for the semester project',
    dueDate: new Date('2024-02-05'),
    status: 'graded',
    grade: 85,
    maxGrade: 100,
    submittedAt: new Date('2024-02-04')
  }
];

export const quizzes= [
  {
    id: '1',
    title: 'Arrays and Pointers',
    subject: subjects[0],
    questions: 15,
    duration: 30,
    attempts: 2,
    maxAttempts: 3,
    bestScore: 85,
    status: 'completed',
    dueDate: new Date('2024-02-12')
  },
  {
    id: '2',
    title: 'Derivatives and Integrals',
    subject: subjects[1],
    questions: 20,
    duration: 45,
    attempts: 0,
    maxAttempts: 2,
    status: 'available',
    dueDate: new Date('2024-02-18')
  },
  {
    id: '3',
    title: 'SQL Basics',
    subject: subjects[2],
    questions: 12,
    duration: 25,
    attempts: 0,
    maxAttempts: 3,
    status: 'available',
    dueDate: new Date('2024-02-22')
  }
];

export const tests = [
  {
    id: '1',
    title: 'Midterm Examination',
    subject: subjects[0],
    date: new Date('2024-03-15'),
    duration: 120,
    location: 'Room A101',
    type: 'midterm',
    status: 'upcoming',
    maxGrade: 100
  },
  {
    id: '2',
    title: 'Calculus Final Exam',
    subject: subjects[1],
    date: new Date('2024-03-20'),
    duration: 180,
    location: 'Main Hall',
    type: 'final',
    status: 'upcoming',
    maxGrade: 200
  },
  {
    id: '3',
    title: 'Database Practical Test',
    subject: subjects[2],
    date: new Date('2024-02-25'),
    duration: 90,
    location: 'Computer Lab B',
    type: 'practical',
    status: 'upcoming',
    maxGrade: 50
  }
];

export const grades = [
  {
    id: '1',
    subject: subjects[3],
    type: 'assignment',
    title: 'Software Requirements Document',
    grade: 85,
    maxGrade: 100,
    date: new Date('2024-02-05')
  },
  {
    id: '2',
    subject: subjects[0],
    type: 'quiz',
    title: 'Arrays and Pointers',
    grade: 85,
    maxGrade: 100,
    date: new Date('2024-02-01')
  },
  {
    id: '3',
    subject: subjects[1],
    type: 'assignment',
    title: 'Problem Set 2',
    grade: 92,
    maxGrade: 100,
    date: new Date('2024-01-28')
  }
];

export const notifications = [
  {
    id: '1',
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'Data Structures Implementation is due in 2 days',
    subject: subjects[0],
    date: new Date('2024-02-13'),
    isRead: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'grade',
    title: 'Grade Posted',
    message: 'Your grade for Software Requirements Document has been posted',
    subject: subjects[3],
    date: new Date('2024-02-12'),
    isRead: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'quiz',
    title: 'New Quiz Available',
    message: 'SQL Basics quiz is now available for attempt',
    subject: subjects[2],
    date: new Date('2024-02-11'),
    isRead: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'test',
    title: 'Test Reminder',
    message: 'Database Practical Test scheduled for Feb 25, 2024',
    subject: subjects[2],
    date: new Date('2024-02-10'),
    isRead: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'note',
    title: 'New Study Material',
    message: 'Lecture notes for Chapter 5 have been uploaded',
    subject: subjects[0],
    date: new Date('2024-02-09'),
    isRead: false,
    priority: 'low'
  },
  {
    id: '6',
    type: 'announcement',
    title: 'Class Schedule Change',
    message: 'Mathematics class moved to Room B205 for next week',
    subject: subjects[1],
    date: new Date('2024-02-08'),
    isRead: true,
    priority: 'medium'
  }
];

export const notes= [
  {
    id: '1',
    title: 'Introduction to Data Structures',
    subject: subjects[0],
    description: 'Comprehensive overview of arrays, linked lists, and basic operations',
    fileUrl: '/notes/cs101-chapter1.pdf',
    fileName: 'CS101_Chapter1_DataStructures.pdf',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Smith',
    uploadedAt: new Date('2024-02-01'),
    category: 'lecture',
    week: 1,
    chapter: 'Chapter 1'
  },
  {
    id: '2',
    title: 'Calculus Integration Techniques',
    subject: subjects[1],
    description: 'Step-by-step guide to integration by parts and substitution methods',
    fileUrl: '/notes/math201-integration.pdf',
    fileName: 'MATH201_Integration_Techniques.pdf',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    uploadedBy: 'Prof. Johnson',
    uploadedAt: new Date('2024-02-03'),
    category: 'tutorial',
    week: 2,
    chapter: 'Chapter 3'
  },
  {
    id: '3',
    title: 'SQL Query Examples',
    subject: subjects[2],
    description: 'Collection of SQL queries with explanations and best practices',
    fileUrl: '/notes/cs301-sql-examples.pdf',
    fileName: 'CS301_SQL_Examples.pdf',
    fileSize: '3.1 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Williams',
    uploadedAt: new Date('2024-02-05'),
    category: 'reference',
    week: 3,
    chapter: 'Chapter 4'
  },
  {
    id: '4',
    title: 'Software Development Lifecycle',
    subject: subjects[3],
    description: 'Detailed presentation on SDLC phases and methodologies',
    fileUrl: '/notes/cs401-sdlc.ppt',
    fileName: 'CS401_SDLC_Overview.pptx',
    fileSize: '4.2 MB',
    fileType: 'ppt',
    uploadedBy: 'Prof. Brown',
    uploadedAt: new Date('2024-02-07'),
    category: 'lecture',
    week: 4,
    chapter: 'Chapter 2'
  },
  {
    id: '5',
    title: 'Database Normalization Guide',
    subject: subjects[2],
    description: 'Complete guide to database normalization with examples',
    fileUrl: '/notes/cs301-normalization.pdf',
    fileName: 'CS301_Database_Normalization.pdf',
    fileSize: '2.7 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Williams',
    uploadedAt: new Date('2024-02-09'),
    category: 'tutorial',
    week: 5,
    chapter: 'Chapter 5'
  },
  {
    id: '6',
    title: 'Algorithm Complexity Analysis',
    subject: subjects[0],
    description: 'Understanding Big O notation and time complexity analysis',
    fileUrl: '/notes/cs101-complexity.pdf',
    fileName: 'CS101_Algorithm_Complexity.pdf',
    fileSize: '1.9 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Smith',
    uploadedAt: new Date('2024-02-11'),
    category: 'reference',
    week: 6,
    chapter: 'Chapter 3'
  }
];

export const subjectResources = subjects.map(subject => {
  const subjectNotes = notes.filter(note => note.subject.id === subject.id);
  const recentNotes = subjectNotes.slice(0, 3);
  
  return {
    id: subject.id,
    subject,
    totalNotes: subjectNotes.length,
    recentNotes,
    classroomUrl: subject.classroomUrl,
    driveUrl: subject.driveUrl,
    syllabus: `/syllabus/${subject.code.toLowerCase()}.pdf`,
    announcements: Math.floor(Math.random() * 5) + 1,
    lastUpdated: new Date(2024, 1, Math.floor(Math.random() * 15) + 1)
  };
});