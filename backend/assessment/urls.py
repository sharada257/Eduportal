
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, QuizViewSet, TestViewSet, SubmissionViewSet,SubjectTeacherSectionViewSet

router = DefaultRouter()
router.register(r'assignments', AssignmentViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'tests', TestViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'subject-teacher-sections', SubjectTeacherSectionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
