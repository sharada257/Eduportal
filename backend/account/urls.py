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

"""
http://127.0.0.1:8000/api/admin-profiles/a04441a6-fd36-408e-90a9-1d4a7fdd0c97/
{
    "id": "a04441a6-fd36-408e-90a9-1d4a7fdd0c97",
    "user": "sharada",
    "department": "COMPUTER SCIENCE",
    "created_by": null,
    "updated_by": null,
    "date_of_joining": "2025-07-05",
    "created_at": "2025-07-05T17:18:21.866748Z",
    "updated_at": "2025-07-05T17:18:21.873745Z",
    "is_active": true
}

"""

