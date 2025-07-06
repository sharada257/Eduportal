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
