# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherProfileViewSet
from .views import StudentProfileViewSet, AdminProfileViewSet


router = DefaultRouter()
router.register(r'teacher-profiles', TeacherProfileViewSet, basename='teacher')
router.register(r'student-profiles', StudentProfileViewSet, basename='student-profile')
router.register(r'admin-profiles', AdminProfileViewSet, basename='admin-profile')


urlpatterns = [
    path('', include(router.urls)),
]

