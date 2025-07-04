import uuid
from django.db import models

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department_name = models.CharField(max_length=100, db_index=True)
    short_name = models.CharField(max_length=20, blank=True, null=True)
    total_faculty_count = models.IntegerField(default=0)
    total_student_capacity = models.IntegerField(default=0)
    current_student_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.department_name


class Section(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, related_name='sections', on_delete=models.CASCADE)
    current_semester = models.PositiveSmallIntegerField(default=1)
    academic_year = models.CharField(max_length=20)
    batch_year = models.IntegerField()
    capacity = models.IntegerField(default=60)
    max_capacity = models.IntegerField(default=60)
    academic_status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.section_code


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_open_elective = models.BooleanField(default=False)
    subject_code = models.CharField(max_length=20, unique=True)
    subject_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    credits = models.IntegerField(default=0)
    department = models.ForeignKey(Department, related_name='subjects', on_delete=models.CASCADE)
    semester = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.subject_name

