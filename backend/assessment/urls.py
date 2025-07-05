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

QUIZZES:
- GET    /api/quizzes/                         - List all quizzes
- POST   /api/quizzes/                         - Create new quiz
- GET    /api/quizzes/{id}/                    - Get specific quiz
- PUT    /api/quizzes/{id}/                    - Update quiz
- PATCH  /api/quizzes/{id}/                    - Partial update quiz
- DELETE /api/quizzes/{id}/                    - Delete quiz
- GET    /api/quizzes/by_section/?section_id={id}      - Get quizzes by section

TESTS:
- GET    /api/tests/                           - List all tests
- POST   /api/tests/                           - Create new test
- GET    /api/tests/{id}/                      - Get specific test
- PUT    /api/tests/{id}/                      - Update test
- PATCH  /api/tests/{id}/                      - Partial update test
- DELETE /api/tests/{id}/                      - Delete test
- GET    /api/tests/by_section/?section_id={id}        - Get tests by section
- GET    /api/tests/upcoming/?section_id={id}          - Get upcoming tests

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
"""