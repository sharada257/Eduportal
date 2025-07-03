# serializers.py
from rest_framework import serializers
from .models import Assignment, Quiz, Test, Submission
from core.models import Subject, Section, TeacherProfile, StudentProfile

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'name']

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['id', 'name']

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id', 'name']

class AssignmentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherProfileSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherProfileSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Quiz
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    teacher = TeacherProfileSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Test
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    quiz = QuizSerializer(read_only=True)
    test = TestSerializer(read_only=True)
    student = StudentProfileSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'

