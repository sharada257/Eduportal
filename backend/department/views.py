from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import Q
import logging

from .models import Department, Semester, Section, Subject
from .serializers import (
    DepartmentSerializer, 
    SemesterSerializer, 
    SectionSerializer, 
    SubjectSerializer
)

logger = logging.getLogger(__name__)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Department model with CRUD operations
    """
    queryset = Department.objects.filter(deleted_at__isnull=True)
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Filter active departments by default"""
        queryset = super().get_queryset()
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new department with error handling"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                with transaction.atomic():
                    department = serializer.save()
                    logger.info(f"Department created: {department.department_name}")
                    return Response(
                        serializer.data, 
                        status=status.HTTP_201_CREATED
                    )
            else:
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error creating department: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        """Update department with error handling"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            
            if serializer.is_valid():
                with transaction.atomic():
                    department = serializer.save()
                    logger.info(f"Department updated: {department.department_name}")
                    return Response(serializer.data)
            else:
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Department.DoesNotExist:
            return Response(
                {'error': 'Department not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error updating department: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        """Soft delete department"""
        try:
            instance = self.get_object()
            # Check if department has active semesters
            if instance.semesters.filter(is_active=True).exists():
                return Response(
                    {'error': 'Cannot delete department with active semesters'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                instance.is_active = False
                instance.save()
                logger.info(f"Department soft deleted: {instance.department_name}")
                return Response(
                    {'message': 'Department deactivated successfully'},
                    status=status.HTTP_200_OK
                )
        except Department.DoesNotExist:
            return Response(
                {'error': 'Department not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error deleting department: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def semesters(self, request, id=None):
        """Get all semesters for a department"""
        try:
            department = self.get_object()
            semesters = department.semesters.filter(is_active=True)
            serializer = SemesterSerializer(semesters, many=True)
            return Response(serializer.data)
        except Department.DoesNotExist:
            return Response(
                {'error': 'Department not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching department semesters: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SemesterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Semester model with CRUD operations
    """
    queryset = Semester.objects.filter(is_active=True)
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Filter semesters by department if provided"""
        queryset = super().get_queryset()
        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new semester with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Check if department exists and is active
                department_id = request.data.get('department')
                try:
                    department = Department.objects.get(id=department_id, is_active=True)
                except Department.DoesNotExist:
                    return Response(
                        {'error': 'Department not found or inactive'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                with transaction.atomic():
                    semester = serializer.save()
                    logger.info(f"Semester created: {semester}")
                    return Response(
                        serializer.data,
                        status=status.HTTP_201_CREATED
                    )
            else:
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error creating semester: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def subjects(self, request, id=None):
        """Get all subjects for a semester"""
        try:
            semester = self.get_object()
            subjects = semester.subjects.filter(is_active=True)
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data)
        except Semester.DoesNotExist:
            return Response(
                {'error': 'Semester not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching semester subjects: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Section model with CRUD operations
    """
    queryset = Section.objects.filter(is_active=True)
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Filter sections by department or semester if provided"""
        queryset = super().get_queryset()
        department_id = self.request.query_params.get('department_id')
        semester_id = self.request.query_params.get('semester_id')
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new section with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Validate department and semester existence
                department_id = request.data.get('department')
                semester_id = request.data.get('semester')
                
                try:
                    department = Department.objects.get(id=department_id, is_active=True)
                except Department.DoesNotExist:
                    return Response(
                        {'error': 'Department not found or inactive'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if semester_id:
                    try:
                        semester = Semester.objects.get(id=semester_id, is_active=True)
                        # Validate that semester belongs to the department
                        if semester.department_id != department_id:
                            return Response(
                                {'error': 'Semester does not belong to the specified department'},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except Semester.DoesNotExist:
                        return Response(
                            {'error': 'Semester not found or inactive'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                with transaction.atomic():
                    section = serializer.save()
                    logger.info(f"Section created: {section.section_name}")
                    return Response(
                        serializer.data,
                        status=status.HTTP_201_CREATED
                    )
            else:
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error creating section: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def subjects(self, request, id=None):
        """Get all subjects for a section based on its semester"""
        try:
            section = self.get_object()
            
            if not section.semester:
                return Response(
                    {'error': 'Section is not assigned to any semester'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get subjects for the section's semester
            subjects = section.semester.subjects.filter(is_active=True)
            serializer = SubjectSerializer(subjects, many=True)
            
            return Response({
                'section': {
                    'id': section.id,
                    'name': section.section_name,
                    'semester': section.semester.name,
                    'department': section.department.department_name
                },
                'subjects': serializer.data
            })
        except Section.DoesNotExist:
            return Response(
                {'error': 'Section not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error fetching section subjects: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Subject model with CRUD operations
    """
    queryset = Subject.objects.filter(is_active=True)
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Filter subjects by department, semester, or section if provided"""
        queryset = super().get_queryset()
        department_id = self.request.query_params.get('department_id')
        semester_id = self.request.query_params.get('semester_id')
        section_id = self.request.query_params.get('section_id')
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)
        if section_id:
            # Get subjects through section's semester
            try:
                section = Section.objects.get(id=section_id, is_active=True)
                if section.semester:
                    queryset = queryset.filter(semester_id=section.semester.id)
                else:
                    queryset = queryset.none()
            except Section.DoesNotExist:
                queryset = queryset.none()
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new subject with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                # Validate department and semester existence
                department_id = request.data.get('department')
                semester_id = request.data.get('semester')
                
                try:
                    department = Department.objects.get(id=department_id, is_active=True)
                except Department.DoesNotExist:
                    return Response(
                        {'error': 'Department not found or inactive'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if semester_id:
                    try:
                        semester = Semester.objects.get(id=semester_id, is_active=True)
                        # Validate that semester belongs to the department
                        if semester.department_id != department_id:
                            return Response(
                                {'error': 'Semester does not belong to the specified department'},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except Semester.DoesNotExist:
                        return Response(
                            {'error': 'Semester not found or inactive'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                with transaction.atomic():
                    subject = serializer.save()
                    logger.info(f"Subject created: {subject.subject_name}")
                    return Response(
                        serializer.data,
                        status=status.HTTP_201_CREATED
                    )
            else:
                return Response(
                    {
                        'error': 'Validation failed',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error creating subject: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get subjects by section ID - Main endpoint for your requirement"""
        try:
            section_id = request.query_params.get('section_id')
            
            if not section_id:
                return Response(
                    {'error': 'section_id parameter is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                section = Section.objects.get(id=section_id, is_active=True)
            except Section.DoesNotExist:
                return Response(
                    {'error': 'Section not found or inactive'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if not section.semester:
                return Response(
                    {'error': 'Section is not assigned to any semester'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get subjects for the section's semester
            subjects = section.semester.subjects.filter(is_active=True)
            serializer = self.get_serializer(subjects, many=True)
            
            return Response({
                'section_info': {
                    'id': section.id,
                    'name': section.section_name,
                    'semester': {
                        'id': section.semester.id,
                        'name': section.semester.name,
                        'number': section.semester.semester_number
                    },
                    'department': {
                        'id': section.department.id,
                        'name': section.department.department_name
                    }
                },
                'subjects': serializer.data,
                'total_subjects': subjects.count()
            })
            
        except Exception as e:
            logger.error(f"Error fetching subjects by section: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def electives(self, request):
        """Get open elective subjects"""
        try:
            department_id = request.query_params.get('department_id')
            queryset = self.get_queryset().filter(is_open_elective=True)
            
            if department_id:
                queryset = queryset.filter(department_id=department_id)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching elective subjects: {str(e)}")
            return Response(
                {'error': 'Internal server error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )