from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import (
    User, TeacherProfile, Department, TeacherAssignment,
    StudentProfile, AdminProfile
)
from .serializers import (
    UserCreateSerializer, UserUpdateSerializer, UserResponseSerializer, UserSummarySerializer,
    TeacherProfileCreateSerializer, TeacherProfileUpdateSerializer,
    TeacherProfileDetailSerializer, TeacherProfileListItemSerializer,
    StudentProfileSerializer, AdminProfileSerializer
)
from .permissions import IsAdminUser, IsTeacher


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserResponseSerializer  # default

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return UserUpdateSerializer
        elif self.action == "list":
            return UserSummarySerializer
        return UserResponseSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get("user_type")
        is_active = self.request.query_params.get("is_active")
        is_verified = self.request.query_params.get("is_verified")
        search = self.request.query_params.get("search")

        if user_type:
            queryset = queryset.filter(user_type=user_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        if User.objects.filter(email=request.data.get("email")).exists():
            return Response({"detail": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False  # Soft delete
        instance.save()
        return Response({"id": str(instance.id)}, status=status.HTTP_200_OK)


class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.select_related('user', 'department')
    serializer_class = TeacherProfileDetailSerializer

    def get_permissions(self):
        if self.action in ['me', 'update_me']:
            return [IsTeacher()]
        elif self.action in ['list', 'destroy', 'update', 'partial_update', 'retrieve', 'create']:
            return [IsAdminUser()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return TeacherProfileCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TeacherProfileUpdateSerializer
        elif self.action == 'list':
            return TeacherProfileListItemSerializer
        return TeacherProfileDetailSerializer

    def list(self, request):
        query = self.get_queryset().filter(user__deleted_at__isnull=True)
        filters = request.query_params

        if eid := filters.get("employee_id"):
            query = query.filter(employee_id__icontains=eid)
        if dept := filters.get("department_id"):
            query = query.filter(department_id=dept)
        if desg := filters.get("designation"):
            query = query.filter(designation__icontains=desg)
        if qual := filters.get("qualification"):
            query = query.filter(qualification__icontains=qual)
        if min_exp := filters.get("min_experience"):
            query = query.filter(experience_years__gte=min_exp)
        if max_exp := filters.get("max_experience"):
            query = query.filter(experience_years__lte=max_exp)
        if active := filters.get("is_active"):
            query = query.filter(user__is_active=active.lower() == 'true')
        if created_after := filters.get("created_after"):
            query = query.filter(created_at__gte=created_after)
        if created_before := filters.get("created_before"):
            query = query.filter(created_at__lte=created_before)
        if search := filters.get("search_query"):
            query = query.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(employee_id__icontains=search)
            )

        page = self.paginate_queryset(query)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsTeacher])
    def me(self, request):
        profile = TeacherProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Teacher profile not found"}, status=404)
        return Response(self.get_serializer(profile).data)

    @action(detail=False, methods=['put'], permission_classes=[IsTeacher])
    def update_me(self, request):
        profile = TeacherProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"detail": "Teacher profile not found"}, status=404)
        serializer = TeacherProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Teacher profile updated",
            "data": TeacherProfileDetailSerializer(profile).data
        })

    def destroy(self, request, *args, **kwargs):
        profile = self.get_object()
        if TeacherAssignment.objects.filter(teacher=profile, is_active=True).exists():
            return Response({"detail": "Cannot delete teacher profile with active assignments"}, status=400)
        profile.delete()
        return Response({"success": True, "message": "Teacher profile deleted"}, status=200)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.select_related('user', 'section', 'created_by', 'updated_by')
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.select_related('user', 'department', 'created_by', 'updated_by')
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]
