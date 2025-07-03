from rest_framework.permissions import BasePermission

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Teacher').exists()

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser
