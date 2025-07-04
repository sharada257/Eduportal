
# views.py
from rest_framework import viewsets, filters
from .models import Assignment, Quiz, Test, Submission,SubjectTeacherSection
from .serializers import AssignmentSerializer, QuizSerializer, TestSerializer, SubmissionSerializer, SubjectTeacherSectionSerializer
from django_filters.rest_framework import DjangoFilterBackend

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['teacher', 'subject', 'section']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at']

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['teacher', 'subject', 'section']
    search_fields = ['title']
    ordering_fields = ['created_at', 'total_marks']

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['teacher', 'subject', 'section']
    search_fields = ['title']
    ordering_fields = ['scheduled_date']

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['student', 'type', 'assignment', 'quiz', 'test']
    ordering_fields = ['submitted_at', 'obtained_marks']


class SubjectTeacherSectionViewSet(viewsets.ModelViewSet):
    queryset = SubjectTeacherSection.objects.all()
    serializer_class = SubjectTeacherSectionSerializer
