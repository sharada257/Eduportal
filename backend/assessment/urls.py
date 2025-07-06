from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssignmentViewSet, QuizViewSet, TestViewSet, 
    SubmissionViewSet, SubjectTeacherSectionViewSet
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'tests', TestViewSet, basename='test')
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'subject-teacher-sections', SubjectTeacherSectionViewSet, basename='subjectteachersection')

# Define URL patterns
urlpatterns = [
    # Include all the router URLs
    path('', include(router.urls)),
    
    # Alternative URL patterns for specific actions (optional)
    # These are automatically handled by the router, but you can add custom patterns here
]

# Available endpoints:
"""
ASSIGNMENTS:
- GET    /api/assignments/                     - List all assignments
- POST   /api/assignments/                     - Create new assignment
- GET    /api/assignments/{id}/                - Get specific assignment
- PUT    /api/assignments/{id}/                - Update assignment
- PATCH  /api/assignments/{id}/                - Partial update assignment
- DELETE /api/assignments/{id}/                - Delete assignment
- GET    /api/assignments/by_section/?section_id={id}  - Get assignments by section
- GET    /api/assignments/upcoming/?section_id={id}    - Get upcoming assignments

[
    {
        "id": "a5f8f4f4-f342-4933-bc39-58a0c5b7f285",
        "title": "Ass-1",
        "subject": "cec7b83c-a5c8-4761-b0f1-84525fb5097d",
        "subject_name": "DMML",
        "subject_code": "22CSE47",
        "teacher": "4d309d03-3bb7-4bc5-8817-01237437c7ec",
        "teacher_name": "sharada kumari",
        "section": "65e161fc-95fe-4d92-a579-0b4d9c33f941",
        "section_name": "A",
        "description": "",
        "due_date": "2025-07-08T00:00:00Z",
        "created_at": "2025-07-05T16:55:08Z",
        "updated_at": "2025-07-05T16:55:25.886203Z",
        "is_active": true,
        "is_overdue": false,
        "days_remaining": 2
    }
]



QUIZZES:
- GET    /api/quizzes/                         - List all quizzes
- POST   /api/quizzes/                         - Create new quiz
- GET    /api/quizzes/{id}/                    - Get specific quiz
- PUT    /api/quizzes/{id}/                    - Update quiz
- PATCH  /api/quizzes/{id}/                    - Partial update quiz
- DELETE /api/quizzes/{id}/                    - Delete quiz
- GET    /api/quizzes/by_section/?section_id={id}      - Get quizzes by section


[
    {
        "id": "086a802c-4dfb-4512-8f2d-e8bc7f799433",
        "title": "quiz-1",
        "subject": "cec7b83c-a5c8-4761-b0f1-84525fb5097d",
        "subject_name": "DMML",
        "subject_code": "22CSE47",
        "teacher": "4d309d03-3bb7-4bc5-8817-01237437c7ec",
        "teacher_name": "sharada kumari",
        "section": "65e161fc-95fe-4d92-a579-0b4d9c33f941",
        "section_name": "A",
        "total_marks": 3,
        "created_at": "2025-07-05T16:56:04Z",
        "updated_at": "2025-07-05T16:56:17.799372Z",
        "is_active": true
    }
]



TESTS:
- GET    /api/tests/                           - List all tests
- POST   /api/tests/                           - Create new test
- GET    /api/tests/{id}/                      - Get specific test
- PUT    /api/tests/{id}/                      - Update test
- PATCH  /api/tests/{id}/                      - Partial update test
- DELETE /api/tests/{id}/                      - Delete test
- GET    /api/tests/by_section/?section_id={id}        - Get tests by section
- GET    /api/tests/upcoming/?section_id={id}          - Get upcoming tests


{
        "id": "21a23def-59a0-433c-9a0e-97ac80a439e5",
        "title": "test-2",
        "subject": "cec7b83c-a5c8-4761-b0f1-84525fb5097d",
        "subject_name": "DMML",
        "subject_code": "22CSE47",
        "teacher": "4d309d03-3bb7-4bc5-8817-01237437c7ec",
        "teacher_name": "sharada",
        "section": "65e161fc-95fe-4d92-a579-0b4d9c33f941",
        "section_name": "A",
        "scheduled_date": "2025-07-05T18:00:00Z",
        "total_marks": 5,
        "created_at": "2025-07-05T14:06:17Z",
        "updated_at": "2025-07-05T14:07:21.087450Z",
        "is_active": true,
        "is_upcoming": true,
        "days_until_test": 0
    },
    
]

SUBMISSIONS:
- GET    /api/submissions/                     - List all submissions
- POST   /api/submissions/                     - Create new submission
- GET    /api/submissions/{id}/                - Get specific submission
- PUT    /api/submissions/{id}/                - Update submission
- PATCH  /api/submissions/{id}/                - Partial update submission
- DELETE /api/submissions/{id}/                - Delete submission
- GET    /api/submissions/by_section/?section_id={id}  - Get submissions by section
- GET    /api/submissions/pending_evaluation/?section_id={id} - Get pending evaluations
- PATCH  /api/submissions/{id}/evaluate/      - Evaluate submission



SUBJECT-TEACHER-SECTIONS:
- GET    /api/subject-teacher-sections/        - List all assignments
- POST   /api/subject-teacher-sections/        - Create new assignment
- GET    /api/subject-teacher-sections/{id}/   - Get specific assignment
- PUT    /api/subject-teacher-sections/{id}/   - Update assignment
- PATCH  /api/subject-teacher-sections/{id}/   - Partial update assignment
- DELETE /api/subject-teacher-sections/{id}/   - Delete assignment
- GET    /api/subject-teacher-sections/by_section/?section_id={id} - Get by section
- GET    /api/subject-teacher-sections/by_teacher/?teacher_id={id} - Get by teacher

Query Parameters:
- section_id: Filter by section ID
- subject_id: Filter by subject ID
- teacher_id: Filter by teacher ID
- type: Filter submissions by type (assignment/quiz/test)


to get the courses taught by a teacher 
http://127.0.0.1:8000/api/subject-teacher-sections/by_teacher/?teacher_id=4d309d03-3bb7-4bc5-8817-01237437c7ec


[
    {
        "id": "e3f74a45-82fc-4cf5-9d65-d6c50a196ded",
        "subject": "cec7b83c-a5c8-4761-b0f1-84525fb5097d",
        "subject_name": "DMML",
        "subject_code": "22CSE47",
        "teacher": "4d309d03-3bb7-4bc5-8817-01237437c7ec",
        "teacher_name": "sharada kumari",
        "teacher_email": "a@gmail.com",
        "section": "65e161fc-95fe-4d92-a579-0b4d9c33f941",
        "section_name": "A",
        "department_name": "COMPUTER SCIENCE",
        "created_at": "2025-07-06T08:28:19.509447Z",
        "updated_at": "2025-07-06T08:28:19.509465Z",
        "is_active": true
    }
]

to get students taught by a teacher
http://127.0.0.1:8000/api/subject-teacher-sections/by_teacher_student/?teacher_id=4d309d03-3bb7-4bc5-8817-01237437c7ec


[
    {
        "id": "5e178d81-7433-4e7a-9602-c338049d1cb6",
        "first_name": "sharada",
        "last_name": "kumari",
        "email": "a@gmail.com",
        "section": "A",
        "registration_number": "134135",
        "admission_year": 2,
        "semester": null,
        "academic_status": "active",
        "semester_number": null
    }
]


"""