import uuid
from datetime import datetime
from enum import Enum
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from account.models import TeacherProfile, StudentProfile
from department.models import Subject, Section

class Assignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)


class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, blank=True)
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)


class Test(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="tests")
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name="tests")
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    scheduled_date = models.DateTimeField()
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)


class SubmissionType(Enum):
    ASSIGNMENT = "assignment"
    QUIZ = "quiz"
    TEST = "test"


class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.SET_NULL, null=True, blank=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.SET_NULL, null=True, blank=True)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="submissions")
    type = models.CharField(max_length=20, choices=[(tag.value, tag.value.title()) for tag in SubmissionType])
    submitted_at = models.DateTimeField(default=timezone.now)
    is_evaluated = models.BooleanField(default=True)
    obtained_marks = models.IntegerField(null=True, blank=True)
    file_url = models.URLField(null=True, blank=True)

    def clean(self):
        filled = [bool(self.assignment), bool(self.quiz), bool(self.test)]
        if filled.count(True) != 1:
            raise ValidationError("Only one of assignment, quiz or test must be set.")



class SubjectTeacherSection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.ForeignKey(Subject, related_name='subject_teacher_sections', on_delete=models.CASCADE)
    teacher = models.ForeignKey('account.TeacherProfile', related_name='subject_teacher_sections', on_delete=models.CASCADE)
    section = models.ForeignKey(Section, related_name='subject_teacher_sections', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('subject', 'teacher', 'section')

    def __str__(self):
        return f"{self.subject.subject_code} - {self.teacher.id} - {self.section.section_name}"
