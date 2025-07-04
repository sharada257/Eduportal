import axios from "axios";

export const ENDPOINT = {
    departments: "/departments/",
    department: (id) => `/departments/${id}/`,

    sections: "/sections/",
    section: (id) => `/sections/${id}/`,

    subjects: "/subjects/",
    subject: (id) => `/subjects/${id}/`,

    subjectTeacherSections: "/subject-teacher-sections/",
    subjectTeacherSection: (id) => `/subject-teacher-sections/${id}/`,

    assignments: "/api/assignments/",
    assignment: (id) => `/api/assignments/${id}/`,

    quizzes: "/api/quizzes/",
    quiz: (id) => `/api/quizzes/${id}/`,

    tests: "/api/tests/",
    test: (id) => `/api/tests/${id}/`,

    submissions: "/api/submissions/",
    submission: (id) => `/api/submissions/${id}/`,

    teachers: "/teachers/",
    teacher: (id) => `/teachers/${id}/`,

    studentProfiles: "/student-profiles/",
    studentProfile: (id) => `/student-profiles/${id}/`,

    adminProfiles: "/admin-profiles/",
    adminProfile: (id) => `/admin-profiles/${id}/`,
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
