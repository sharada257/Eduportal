import axios from "axios";

export const ENDPOINT = {
    login : "auth/login",
    teacherRegister: "/auth/teacher/register",
    studentRegister: "/auth/student/register",
    departments: "/departments/",
    departmentSections: (departmentId) => `/departments/${departmentId}/sections`,
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const api = axios.create({
    baseURL: API_BASE_URL,
    // credentials
    withCredentials: true,
});
