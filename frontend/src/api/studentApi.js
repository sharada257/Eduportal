import {api, ENDPOINT} from "@/lib/api";


export const fetchTeacherProfiles = () => api.get(ENDPOINT.teacher()); // GET /api/teachers/
export const fetchTeacherProfile = (teacherId) => api.get(ENDPOINT.teacher(teacherId)); // GET /api/teachers/:id/
export const createTeacherProfile = (data) => api.post(ENDPOINT.teacher(), data); // POST /api/teachers/
export const updateTeacherProfile = (teacherId, data) => api.put(ENDPOINT.teacher(teacherId), data); // PUT /api/teachers/:id/
export const patchTeacherProfile = (teacherId, data) => api.patch(ENDPOINT.teacher(teacherId), data); // PATCH /api/teachers/:id/
export const deleteTeacherProfile = (teacherId,data) => api.put(ENDPOINT.teacher(teacherId),data); // DELETE /api/teachers/:id/


export const fetchStudentProfiles = () => api.get(ENDPOINT.studentProfile()); // GET /api/students/
export const fetchStudentProfile = (studentId) => api.get(ENDPOINT.studentProfile(studentId)); // GET /api/students/:id/
export const createStudentProfile = (data) => api.post(ENDPOINT.studentProfile(), data); // POST /api/students/
export const updateStudentProfile = (studentId, data) => api.put(ENDPOINT.studentProfile(studentId), data); // PUT /api/students/:id/
export const patchStudentProfile = (studentId, data) => api.patch(ENDPOINT.studentProfile(studentId), data); // PATCH /api/students/:id/
export const deleteStudentProfile = (studentId,data) => api.put(ENDPOINT.studentProfile(studentId),data); // DELETE /api/students/:id/


export const fetchAdminProfiles = () => api.get(ENDPOINT.adminProfile()); // GET /api/admins/
export const fetchAdminProfile = (adminId) => api.get(ENDPOINT.adminProfile(adminId)); // GET /api/admins/:id/  
export const createAdminProfile = (data) => api.post(ENDPOINT.adminProfile(), data); // POST /api/admins/
export const updateAdminProfile = (adminId, data) => api.put(ENDPOINT.adminProfile(adminId), data); // PUT /api/admins/:id/
export const patchAdminProfile = (adminId, data) => api.patch(ENDPOINT.adminProfile(adminId), data); // PATCH /api/admins/:id/
export const deleteAdminProfile = (adminId,data) => api.put(ENDPOINT.adminProfile(adminId),data); // DELETE /api/admins/:id/


export const fetchSubjectTeacherSections = () => api.get(ENDPOINT.subjectTeacherSections()); // GET /api/subject-teacher-sections/
export const fetchSubjectTeacherSection = (teacherId) => api.get(ENDPOINT.subjectTeacherSection(teacherId)); // GET /api/subject-teacher-sections/by_teacher/?teacher_id=teacherId
export const createSubjectTeacherSection = (data) => api.post(ENDPOINT.subjectTeacherSections(), data); // POST /api/subject-teacher-sections/
export const updateSubjectTeacherSection = (id, data) => api.put(ENDPOINT.subjectTeacherSection(id), data); // PUT /api/subject-teacher-sections/:id/
export const patchSubjectTeacherSection = (id, data) => api.patch(ENDPOINT.subjectTeacherSection(id), data); // PATCH /api/subject-teacher-sections/:id/
export const deleteSubjectTeacherSection = (id, data) => api.put(ENDPOINT.subjectTeacherSection(id), data); // DELETE /api/subject-teacher-sections/:id/


export const fetchAssignments = () => api.get(ENDPOINT.assignments); // GET /api/assignments/
export const fetchAssignment = (assignmentId) => api.get(ENDPOINT.assignment(assignmentId)); // GET /api/assignments/:id/
export const createAssignment = (data) => api.post(ENDPOINT.assignments, data); // POST /api/assignments/
export const updateAssignment = (assignmentId, data) => api.put(ENDPOINT.assignment(assignmentId), data); // PUT /api/assignments/:id/
export const patchAssignment = (assignmentId, data) => api.patch(ENDPOINT.assignment(assignmentId), data); // PATCH /api/assignments/:id/
export const deleteAssignment = (assignmentId, data) => api.put(ENDPOINT.assignment(assignmentId), data); // DELETE /api/assignments/:id/


export const fetchQuizzes = () => api.get(ENDPOINT.quizzes); // GET /api/quizzes/
export const fetchQuiz = (quizId) => api.get(ENDPOINT.quiz(quizId)); // GET /api/quizzes/:id/                       
export const createQuiz = (data) => api.post(ENDPOINT.quizzes, data); // POST /api/quizzes/
export const updateQuiz = (quizId, data) => api.put(ENDPOINT.quiz(quizId), data); // PUT /api/quizzes/:id/
export const patchQuiz = (quizId, data) => api.patch(ENDPOINT.quiz(quizId), data); // PATCH /api/quizzes/:id/
export const deleteQuiz = (quizId, data) => api.put(ENDPOINT.quiz(quizId), data); // DELETE /api/quizzes/:id/


export const fetchTests = () => api.get(ENDPOINT.tests); // GET /api/tests/
export const fetchTest = (testId) => api.get(ENDPOINT.test(testId)); // GET /api/tests/:id/
export const createTest = (data) => api.post(ENDPOINT.tests, data); // POST /api/tests/
export const updateTest = (testId, data) => api.put(ENDPOINT.test(testId), data); // PUT /api/tests/:id/
export const patchTest = (testId, data) => api.patch(ENDPOINT.test(testId), data); // PATCH /api/tests/:id/
export const deleteTest = (testId) => api.delete(ENDPOINT.test(testId)); // DELETE /api/tests/:id/