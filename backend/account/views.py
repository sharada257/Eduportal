from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from django.db.models import Q

from .models import (
   TeacherProfile,
    StudentProfile, AdminProfile
)
from .serializers import (
    TeacherProfileCreateSerializer, TeacherProfileUpdateSerializer,
    TeacherProfileDetailSerializer, 
   AdminProfileSerializer
)
from .models import StudentProfile
from .serializers import (
    StudentProfileListSerializer,
    StudentProfileDetailSerializer,
    StudentProfileCreateSerializer,
    StudentProfileUpdateSerializer
)



class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return StudentProfileListSerializer
        elif self.action == 'retrieve':
            return StudentProfileDetailSerializer
        elif self.action == 'create':
            return StudentProfileCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return StudentProfileUpdateSerializer
        return StudentProfileDetailSerializer

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except NotFound:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            if serializer.is_valid():
                self.perform_update(serializer)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = False  # Soft delete
            instance.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.select_related('user', 'department', 'created_by', 'updated_by')
    serializer_class = AdminProfileSerializer


# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import TeacherProfile
from .serializers import (
    TeacherProfileListSerializer,
    TeacherProfileDetailSerializer,
    TeacherProfileCreateSerializer,
    TeacherProfileUpdateSerializer
)


class TeacherProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TeacherProfile with different serializers for different operations
    """
    queryset = TeacherProfile.objects.select_related('user', 'department').all()
    
    # Add filtering and searching capabilities
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'user__is_active', 'user__is_verified']
    search_fields = ['user__email', 'employee_id', 'designation', 'qualification']
    ordering_fields = ['created_at', 'updated_at', 'experience_years']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return different serializers based on action"""
        if self.action == 'list':
            return TeacherProfileListSerializer
        elif self.action == 'retrieve':
            return TeacherProfileDetailSerializer
        elif self.action == 'create':
            return TeacherProfileCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TeacherProfileUpdateSerializer
        return TeacherProfileDetailSerializer
    
    def get_queryset(self):
        """
        Optionally filter by user type and active status
        """
        queryset = self.queryset
        
        # Filter by user type if specified
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user__user_type=user_type)
        
        # Filter by active status if specified
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(user__is_active=is_active.lower() == 'true')
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new teacher profile"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        teacher_profile = serializer.save()
        
        # Return detailed response
        response_serializer = TeacherProfileDetailSerializer(teacher_profile)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update teacher profile"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        teacher_profile = serializer.save()
        
        # Return detailed response
        response_serializer = TeacherProfileDetailSerializer(teacher_profile)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['get'])
    def user_info(self, request, pk=None):
        """Get detailed user information for a teacher"""
        teacher_profile = self.get_object()
        user_serializer = UserBasicSerializer(teacher_profile.user)
        return Response(user_serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_department(self, request):
        """Get teachers grouped by department"""
        department_id = request.query_params.get('department_id')
        if not department_id:
            return Response(
                {'error': 'department_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        teachers = self.get_queryset().filter(department_id=department_id)
        serializer = TeacherProfileListSerializer(teachers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active_teachers(self, request):
        """Get all active teachers"""
        active_teachers = self.get_queryset().filter(user__is_active=True)
        serializer = TeacherProfileListSerializer(active_teachers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def verified_teachers(self, request):
        """Get all verified teachers"""
        verified_teachers = self.get_queryset().filter(user__is_verified=True)
        serializer = TeacherProfileListSerializer(verified_teachers, many=True)
        return Response(serializer.data)

