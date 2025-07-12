from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    SemesterViewSet,
    SectionViewSet,
    SubjectViewSet,
    CourseAssignmentViewSet
)

# Create a router and register ViewSets
router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'courses', CourseAssignmentViewSet, basename='courseassignment')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]

# Available endpoints:
"""
Department endpoints:
- GET /api/departments/ - List all departments
- POST /api/departments/ - Create new department
- GET /api/departments/{id}/ - Get specific department
- PUT /api/departments/{id}/ - Update department
- PATCH /api/departments/{id}/ - Partial update department
- DELETE /api/departments/{id}/ - Soft delete department
- GET /api/departments/{id}/semesters/ - Get department's semesters

Semester endpoints:
- GET /api/semesters/ - List all semesters
- POST /api/semesters/ - Create new semester
- GET /api/semesters/{id}/ - Get specific semester
- PUT /api/semesters/{id}/ - Update semester
- PATCH /api/semesters/{id}/ - Partial update semester
- DELETE /api/semesters/{id}/ - Delete semester
- GET /api/semesters/{id}/subjects/ - Get semester's subjects

Section endpoints:
- GET /api/sections/ - List all sections
- POST /api/sections/ - Create new section
- GET /api/sections/{id}/ - Get specific section
- PUT /api/sections/{id}/ - Update section
- PATCH /api/sections/{id}/ - Partial update section
- DELETE /api/sections/{id}/ - Delete section
- GET /api/sections/{id}/subjects/ - Get section's subjects (through semester)

Subject endpoints:
- GET /api/subjects/ - List all subjects
- POST /api/subjects/ - Create new subject
- GET /api/subjects/{id}/ - Get specific subject
- PUT /api/subjects/{id}/ - Update subject
- PATCH /api/subjects/{id}/ - Partial update subject
- DELETE /api/subjects/{id}/ - Delete subject
- GET /api/subjects/by_section/?section_id={id} - Get subjects by section ID (Main endpoint)
- GET /api/subjects/electives/ - Get open elective subjects

Query parameters:
- departments: ?include_inactive=true
- semesters: ?department_id={id}
- sections: ?department_id={id}&semester_id={id}
- subjects: ?department_id={id}&semester_id={id}&section_id={id}
"""