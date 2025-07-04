from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import DepartmentViewSet, SectionViewSet, SubjectViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'subjects', SubjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
