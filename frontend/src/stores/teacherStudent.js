
// import create from 'zustand';
// import { devtools } from 'zustand/middleware';
// import * as studentApi from '@/lib/api/';

// const useTeacherStudentStore = create(devtools((set, get) => ({
//   teacherStudents: [],
//   loading: false,
//   error: null,

//   fetchStudents: async () => {
//     set({ loading: true });
//     try {
//       const res = await studentApi.fetchTeacherStudent(id);
//       set({ teacherStudents: res.data, loading: false });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },
// })))

// export default useTeacherStudentStore;