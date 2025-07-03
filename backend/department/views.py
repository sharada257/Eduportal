from rest_framework import viewsets
from .models import Department, Section, Subject, SubjectTeacherSection
from .serializers import DepartmentSerializer, SectionSerializer, SubjectSerializer, SubjectTeacherSectionSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectTeacherSectionViewSet(viewsets.ModelViewSet):
    queryset = SubjectTeacherSection.objects.all()
    serializer_class = SubjectTeacherSectionSerializer
