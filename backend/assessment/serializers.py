# serializers.py
from rest_framework import serializers
from .models import Assignment, Quiz, Test, Submission,SubjectTeacherSection
from account.serializers import   TeacherProfileSerializer
from department.serializers import SubjectSerializer, SectionSerializer

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

    class Meta:
        model = Submission
        fields = '__all__'


class SubjectTeacherSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectTeacherSection
        fields = '__all__'
