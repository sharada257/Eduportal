from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Assignment, Quiz, Test, Submission, SubjectTeacherSection
from .serializers import (
    AssignmentSerializer, QuizSerializer, TestSerializer, 
    SubmissionSerializer, SubjectTeacherSectionSerializer
)
from account.models import TeacherProfile, StudentProfile
from department.models import Section


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Assignment CRUD operations with section-based filtering
    """
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Assignment.objects.filter(is_active=True)
        
        # Filter by section if provided
        section_id = self.request.query_params.get('section_id')
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        # Filter by subject if provided
        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
            
        return queryset.select_related('subject', 'teacher', 'section').order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Create new assignment with proper validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Validate due date is in future
            due_date = serializer.validated_data.get('due_date')
            if due_date and due_date <= timezone.now():
                return Response(
                    {'error': 'Due date must be in the future'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set teacher from current user if not provided
            if not serializer.validated_data.get('teacher'):
                try:
                    teacher = TeacherProfile.objects.get(user=request.user)
                    serializer.validated_data['teacher'] = teacher
                except TeacherProfile.DoesNotExist:
                    return Response(
                        {'error': 'Only teachers can create assignments'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            assignment = serializer.save()
            return Response(
                AssignmentSerializer(assignment).data,
                status=status.HTTP_201_CREATED
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        """Update assignment with validation"""
        try:
            instance = self.get_object()
            
            # Check if user is the teacher who created the assignment
            if hasattr(request.user, 'teacherprofile'):
                if instance.teacher != request.user.teacherprofile:
                    return Response(
                        {'error': 'You can only update your own assignments'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            
            # Validate due date if being updated
            due_date = serializer.validated_data.get('due_date')
            if due_date and due_date <= timezone.now():
                return Response(
                    {'error': 'Due date must be in the future'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            assignment = serializer.save()
            return Response(AssignmentSerializer(assignment).data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to update assignment'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get assignments for a specific section"""
        section_id = request.query_params.get('section_id')
        if not section_id:
            return Response(
                {'error': 'section_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            section = get_object_or_404(Section, id=section_id)
            assignments = Assignment.objects.filter(
                section=section, 
                is_active=True
            ).select_related('subject', 'teacher').order_by('-created_at')
            
            serializer = AssignmentSerializer(assignments, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve assignments'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming assignments"""
        section_id = request.query_params.get('section_id')
        queryset = Assignment.objects.filter(
            is_active=True,
            due_date__gt=timezone.now()
        )
        
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        assignments = queryset.select_related('subject', 'teacher').order_by('due_date')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


class QuizViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Quiz CRUD operations with section-based filtering
    """
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Quiz.objects.filter(is_active=True)
        
        section_id = self.request.query_params.get('section_id')
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
            
        return queryset.select_related('subject', 'teacher', 'section').order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Create new quiz with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Validate total marks
            total_marks = serializer.validated_data.get('total_marks')
            if total_marks and total_marks <= 0:
                return Response(
                    {'error': 'Total marks must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set teacher from current user if not provided
            if not serializer.validated_data.get('teacher'):
                try:
                    teacher = TeacherProfile.objects.get(user=request.user)
                    serializer.validated_data['teacher'] = teacher
                except TeacherProfile.DoesNotExist:
                    return Response(
                        {'error': 'Only teachers can create quizzes'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            quiz = serializer.save()
            return Response(
                QuizSerializer(quiz).data,
                status=status.HTTP_201_CREATED
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get quizzes for a specific section"""
        section_id = request.query_params.get('section_id')
        if not section_id:
            return Response(
                {'error': 'section_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quizzes = Quiz.objects.filter(
                section_id=section_id,
                is_active=True
            ).select_related('subject', 'teacher').order_by('-created_at')
            
            serializer = QuizSerializer(quizzes, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve quizzes'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Test CRUD operations with section-based filtering
    """
    serializer_class = TestSerializer
    
    def get_queryset(self):
        queryset = Test.objects.filter(is_active=True)
        
        section_id = self.request.query_params.get('section_id')
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
            
        return queryset.select_related('subject', 'teacher', 'section').order_by('-scheduled_date')
    
    def create(self, request, *args, **kwargs):
        """Create new test with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Validate scheduled date is in future
            scheduled_date = serializer.validated_data.get('scheduled_date')
            if scheduled_date and scheduled_date <= timezone.now():
                return Response(
                    {'error': 'Test must be scheduled for future date'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate total marks
            total_marks = serializer.validated_data.get('total_marks')
            if total_marks and total_marks <= 0:
                return Response(
                    {'error': 'Total marks must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set teacher from current user if not provided
            if not serializer.validated_data.get('teacher'):
                try:
                    teacher = TeacherProfile.objects.get(user=request.user)
                    serializer.validated_data['teacher'] = teacher
                except TeacherProfile.DoesNotExist:
                    return Response(
                        {'error': 'Only teachers can create tests'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            test = serializer.save()
            return Response(
                TestSerializer(test).data,
                status=status.HTTP_201_CREATED
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming tests for a section"""
        section_id = request.query_params.get('section_id')
        queryset = Test.objects.filter(
            is_active=True,
            scheduled_date__gt=timezone.now()
        )
        
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        tests = queryset.select_related('subject', 'teacher').order_by('scheduled_date')
        serializer = TestSerializer(tests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get tests for a specific section"""
        section_id = request.query_params.get('section_id')
        if not section_id:
            return Response(
                {'error': 'section_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            tests = Test.objects.filter(
                section_id=section_id,
                is_active=True
            ).select_related('subject', 'teacher').order_by('-scheduled_date')
            
            serializer = TestSerializer(tests, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve tests'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Submission CRUD operations with proper validation
    """
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Submission.objects.select_related('student', 'assignment', 'quiz', 'test')
        
        # Filter by student if current user is a student
        if hasattr(self.request.user, 'studentprofile'):
            queryset = queryset.filter(student=self.request.user.studentprofile)
        
        # Filter by section if provided
        section_id = self.request.query_params.get('section_id')
        if section_id:
            queryset = queryset.filter(
                Q(assignment__section_id=section_id) |
                Q(quiz__section_id=section_id) |
                Q(test__section_id=section_id)
            )
            
        # Filter by submission type
        submission_type = self.request.query_params.get('type')
        if submission_type:
            queryset = queryset.filter(type=submission_type)
            
        return queryset.order_by('-submitted_at')
    
    def create(self, request, *args, **kwargs):
        """Create new submission with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Set student from current user if not provided
            if not serializer.validated_data.get('student'):
                try:
                    student = StudentProfile.objects.get(user=request.user)
                    serializer.validated_data['student'] = student
                except StudentProfile.DoesNotExist:
                    return Response(
                        {'error': 'Only students can create submissions'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            # Validate submission type matches the provided object
            assignment = serializer.validated_data.get('assignment')
            quiz = serializer.validated_data.get('quiz')
            test = serializer.validated_data.get('test')
            submission_type = serializer.validated_data.get('type')
            
            if assignment and submission_type != 'assignment':
                return Response(
                    {'error': 'Submission type must be "assignment" when submitting assignment'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif quiz and submission_type != 'quiz':
                return Response(
                    {'error': 'Submission type must be "quiz" when submitting quiz'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif test and submission_type != 'test':
                return Response(
                    {'error': 'Submission type must be "test" when submitting test'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if assignment is past due date
            if assignment and assignment.due_date < timezone.now():
                return Response(
                    {'error': 'Assignment submission deadline has passed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check for duplicate submissions
            student = serializer.validated_data['student']
            existing_submission = Submission.objects.filter(
                student=student,
                assignment=assignment,
                quiz=quiz,
                test=test
            ).first()
            
            if existing_submission:
                return Response(
                    {'error': 'Submission already exists for this item'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            submission = serializer.save()
            return Response(
                SubmissionSerializer(submission).data,
                status=status.HTTP_201_CREATED
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get submissions for a specific section"""
        section_id = request.query_params.get('section_id')
        if not section_id:
            return Response(
                {'error': 'section_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            submissions = Submission.objects.filter(
                Q(assignment__section_id=section_id) |
                Q(quiz__section_id=section_id) |
                Q(test__section_id=section_id)
            ).select_related('student', 'assignment', 'quiz', 'test').order_by('-submitted_at')
            
            serializer = SubmissionSerializer(submissions, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve submissions'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def pending_evaluation(self, request):
        """Get submissions pending evaluation"""
        section_id = request.query_params.get('section_id')
        queryset = Submission.objects.filter(is_evaluated=False)
        
        if section_id:
            queryset = queryset.filter(
                Q(assignment__section_id=section_id) |
                Q(quiz__section_id=section_id) |
                Q(test__section_id=section_id)
            )
            
        submissions = queryset.select_related('student', 'assignment', 'quiz', 'test').order_by('submitted_at')
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def evaluate(self, request, pk=None):
        """Evaluate a submission"""
        try:
            submission = self.get_object()
            
            # Check if user is a teacher
            if not hasattr(request.user, 'teacherprofile'):
                return Response(
                    {'error': 'Only teachers can evaluate submissions'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            obtained_marks = request.data.get('obtained_marks')
            if obtained_marks is None:
                return Response(
                    {'error': 'obtained_marks is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate obtained marks against total marks
            total_marks = 0
            if submission.assignment:
                # For assignments, you might need to add total_marks field to Assignment model
                pass
            elif submission.quiz:
                total_marks = submission.quiz.total_marks
            elif submission.test:
                total_marks = submission.test.total_marks
            
            if total_marks > 0 and obtained_marks > total_marks:
                return Response(
                    {'error': f'Obtained marks cannot exceed total marks ({total_marks})'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            submission.obtained_marks = obtained_marks
            submission.is_evaluated = True
            submission.save()
            
            return Response(
                SubmissionSerializer(submission).data,
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': 'Failed to evaluate submission'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SubjectTeacherSectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SubjectTeacherSection CRUD operations
    """
    serializer_class = SubjectTeacherSectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = SubjectTeacherSection.objects.filter(is_active=True)
        
        section_id = self.request.query_params.get('section_id')
        if section_id:
            queryset = queryset.filter(section_id=section_id)
            
        teacher_id = self.request.query_params.get('teacher_id')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
            
        subject_id = self.request.query_params.get('subject_id')
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
            
        return queryset.select_related('subject', 'teacher', 'section').order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Create new subject-teacher-section assignment"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Check for existing assignment
            subject = serializer.validated_data['subject']
            teacher = serializer.validated_data['teacher']
            section = serializer.validated_data['section']
            
            existing = SubjectTeacherSection.objects.filter(
                subject=subject,
                teacher=teacher,
                section=section,
                is_active=True
            ).first()
            
            if existing:
                return Response(
                    {'error': 'This subject-teacher-section combination already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            assignment = serializer.save()
            return Response(
                SubjectTeacherSectionSerializer(assignment).data,
                status=status.HTTP_201_CREATED
            )
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """Get subject-teacher assignments for a specific section"""
        section_id = request.query_params.get('section_id')
        if not section_id:
            return Response(
                {'error': 'section_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            assignments = SubjectTeacherSection.objects.filter(
                section_id=section_id,
                is_active=True
            ).select_related('subject', 'teacher', 'section').order_by('subject__subject_code')
            
            serializer = SubjectTeacherSectionSerializer(assignments, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve assignments'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def by_teacher(self, request):
        """Get sections and subjects for a specific teacher"""
        teacher_id = request.query_params.get('teacher_id')
        if not teacher_id:
            return Response(
                {'error': 'teacher_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            assignments = SubjectTeacherSection.objects.filter(
                teacher_id=teacher_id,
                is_active=True
            ).select_related('subject', 'teacher', 'section').order_by('section__section_name')
            
            serializer = SubjectTeacherSectionSerializer(assignments, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to retrieve assignments'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )