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


class Semester(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    semester_number = models.PositiveSmallIntegerField()
    name= models.CharField(max_length=50, blank=True, null=True)  # e.g., "Semester 1", "Semester 2"
    department = models.ForeignKey('Department', on_delete=models.CASCADE, related_name='semesters')
    academic_year = models.CharField(max_length=20)  # e.g., 2024-25
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('semester_number', 'department', 'academic_year')

    def __str__(self):
        return f"Sem {self.semester_number} - {self.department.short_name} ({self.academic_year})"


class Section(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, related_name='sections', on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.PROTECT, related_name="sections",default=None, null=True, blank=True)
    batch_year = models.IntegerField()
    capacity = models.IntegerField(default=60)
    max_capacity = models.IntegerField(default=60)
    academic_status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.section_name


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_open_elective = models.BooleanField(default=False)
    subject_code = models.CharField(max_length=20, unique=True)
    subject_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    credits = models.IntegerField(default=0)
    department = models.ForeignKey(Department, related_name='subjects', on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.PROTECT, related_name="subjects",default=None, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.subject_name
    
    
class CourseAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey('account.TeacherProfile', on_delete=models.CASCADE, related_name='courses')
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='courses')
    section = models.ForeignKey('Section', on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey('Semester', on_delete=models.CASCADE, null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher.user.get_full_name()} teaches {self.subject.subject_name}"


