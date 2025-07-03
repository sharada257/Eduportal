
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, QuizViewSet, TestViewSet, SubmissionViewSet

router = DefaultRouter()
router.register(r'assignments', AssignmentViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'tests', TestViewSet)
router.register(r'submissions', SubmissionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
