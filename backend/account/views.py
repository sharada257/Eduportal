import logging
from django.utils import timezone
from django.db import transaction, IntegrityError
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import (
    UserTypeEnum,
    TeacherProfile,
    StudentProfile,
    AdminProfile
)

from .serializers import (
    TeacherProfileCreateSerializer,
    TeacherProfileUpdateSerializer,
    TeacherProfileDetailSerializer,
    TeacherProfileListSerializer,
    
    StudentProfileCreateSerializer,
    StudentProfileUpdateSerializer,
    StudentProfileDetailSerializer,
    StudentProfileListSerializer,

    AdminProfileSerializer,
    UserBasicSerializer
)

logger = logging.getLogger(__name__)


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


class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common error handling"""
    
    def handle_exception(self, exc):
        """Custom exception handler"""
        if isinstance(exc, ValidationError):
            return Response(
                {'error': 'Validation failed', 'details': exc.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif isinstance(exc, IntegrityError):
            return Response(
                {'error': 'Database integrity error', 'message': str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif isinstance(exc, ObjectDoesNotExist):
            return Response(
                {'error': 'Resource not found', 'message': str(exc)},
                status=status.HTTP_404_NOT_FOUND
            )
        elif isinstance(exc, PermissionDenied):
            return Response(
                {'error': 'Permission denied', 'message': str(exc)},
                status=status.HTTP_403_FORBIDDEN
            )
        
        logger.error(f"Unexpected error in {self.__class__.__name__}: {exc}")
        return super().handle_exception(exc)

class AdminProfileViewSet(BaseViewSet):
    """
    ViewSet for AdminProfile model
    """
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    
    
    
    def create(self, request, *args, **kwargs):
        """Create admin profile (Super Admin only)"""
        try:
            if request.user.user_type != UserTypeEnum.ADMIN:
                raise PermissionDenied("Only admins can create admin profiles")
            
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                
                # Validate user is an admin
                user = serializer.validated_data['user']
                if user.user_type != UserTypeEnum.ADMIN:
                    return Response(
                        {'error': 'User must be of type Admin'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Check if admin profile already exists
                if AdminProfile.objects.filter(user=user).exists():
                    return Response(
                        {'error': 'Admin profile already exists for this user'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Set created_by
                serializer.validated_data['created_by'] = request.user
                
                admin_profile = serializer.save()
                logger.info(f"Admin profile created: {admin_profile.user.email}")
                
                return Response(
                    AdminProfileSerializer(admin_profile).data,
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            return self.handle_exception(e)
    
    def update(self, request, *args, **kwargs):
        """Update admin profile with permission checks"""
        try:
            instance = self.get_object()
            
            # Check permissions
            if not self.can_modify_admin_profile(request.user, instance):
                raise PermissionDenied("You don't have permission to update this admin profile")
            
            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            
            with transaction.atomic():
                # Set updated_by
                serializer.validated_data['updated_by'] = request.user
                admin_profile = serializer.save()
                logger.info(f"Admin profile updated: {admin_profile.user.email}")
                
            return Response(AdminProfileSerializer(admin_profile).data)
        except Exception as e:
            return self.handle_exception(e)
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete admin profile"""
        try:
            instance = self.get_object()
            
            # Prevent deletion of the last admin
            if AdminProfile.objects.filter(is_active=True).count() <= 1:
                return Response(
                    {'error': 'Cannot delete the last active admin profile'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                instance.is_active = False
                instance.updated_by = request.user
                instance.save()
                logger.info(f"Admin profile deactivated: {instance.user.email}")
                
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return self.handle_exception(e)
    
    def can_modify_admin_profile(self, current_user, admin_profile):
        """Check if current user can modify admin profile"""
        if current_user.user_type == UserTypeEnum.ADMIN:
            return True
        return False
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer  # import it

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from .models import TeacherProfile, StudentProfile, AdminProfile
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Try to authenticate the user
        user = authenticate(request, email=email, password=password)
        if not user:
            logger.warning(f"Login failed for email: {email}")
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            logger.warning(f"Inactive user tried to login: {user.email}")
            return Response({"detail": "Account is inactive"}, status=status.HTTP_403_FORBIDDEN)

        try:
            refresh = RefreshToken.for_user(user)
        except Exception as e:
            logger.exception("Error creating JWT token")
            return Response({"detail": "Token generation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(user.user_type)
        # Get profile based on user_type
        profile_data = None
        try:
            if user.user_type == "Teacher":
                profile = TeacherProfile.objects.select_related("user", "department").get(user=user)
                profile_data = {
                    "teacher_id": str(profile.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "employee_id": profile.employee_id,
                    "department": profile.department.department_name if profile.department else None,
                    "designation": profile.designation,
                    "qualification": profile.qualification,
                    "joined_at": profile.joined_at.strftime("%Y-%m-%d") if profile.joined_at else None,
                    "experience_years": profile.experience_years,
                }

            elif user.user_type == "Student":
                profile = StudentProfile.objects.select_related("user", "section", "semester").get(user=user)
                profile_data = {
                    "student_id": str(profile.id),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "registration_number": profile.registration_number,
                    "section": profile.section.section_name,
                    "semester": profile.semester.semester_number if profile.semester else None,
                    "admission_year": profile.admission_year,
                    "cgpa": str(profile.cgpa),
                    "batch_year": profile.batch_year,
                    "date_of_birth": profile.date_of_birth.strftime("%Y-%m-%d") if profile.date_of_birth else None,
                    "academic_status": profile.academic_status,
                }

            elif user.user_type == "Admin":
                profile = AdminProfile.objects.select_related("user", "department").get(user=user)
                profile_data = {
                    "admin_id": str(profile.id),
                    "name": user.get_full_name(),
                    "email": user.email,
                    "department": profile.department.department_name if profile.department else None,
                }

            else:
                logger.error(f"Unknown user_type: {user.user_type} for user {user.email}")
                return Response({"detail": "Unknown user type"}, status=status.HTTP_400_BAD_REQUEST)

        except (TeacherProfile.DoesNotExist, StudentProfile.DoesNotExist, AdminProfile.DoesNotExist) as e:
            logger.error(f"Profile not found for user {user.email}: {str(e)}")
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.exception("Unexpected error retrieving profile")
            return Response({"detail": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_type": user.user_type,
            "user_id": str(user.id),
            "profile": profile_data,
        })

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )

        except TokenError as e:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )
