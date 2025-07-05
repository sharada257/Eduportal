import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from department.models import Department,Section
from django.utils import timezone
from decimal import Decimal

class UserTypeEnum(models.TextChoices):
    ADMIN = "Admin", "Admin"
    TEACHER = "Teacher", "Teacher"
    STUDENT = "Student", "Student"

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    user_type = models.CharField(max_length=20, choices=UserTypeEnum.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TeacherProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    designation = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100)
    experience_years = models.FloatField(default=0)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    office_location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class StudentProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    section = models.ForeignKey(Section, on_delete=models.PROTECT, related_name="student_profiles")
    registration_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    admission_year = models.PositiveIntegerField()
    current_semester = models.PositiveIntegerField(default=1)
    batch_year = models.PositiveIntegerField()
    program_type = models.CharField(max_length=50, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal("0.00"))
    sgpa_current = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal("0.00"))
    total_credits_completed = models.PositiveIntegerField(default=0)
    total_credits_required = models.PositiveIntegerField(default=180)
    date_of_birth = models.DateField()
    academic_status = models.CharField(max_length=20, default='active')
    enrollment_status = models.CharField(max_length=20, default='enrolled')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_created_by")
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_updated_by")
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(cgpa__gte=0.00, cgpa__lte=10.00), name="valid_cgpa_range"),
            models.CheckConstraint(check=models.Q(sgpa_current__gte=0.00, sgpa_current__lte=10.00), name="valid_sgpa_range"),
        ]
        indexes = [
            models.Index(fields=["user", "section", "admission_year", "is_active"]),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - Reg: {self.registration_number}"


class AdminProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="admin_profiles", null=True, blank=True)
    date_of_joining = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin_created_by")
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin_updated_by")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - Admin"

