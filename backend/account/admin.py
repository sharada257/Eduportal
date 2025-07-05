from django.contrib import admin
from .models import User, TeacherProfile, StudentProfile, AdminProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = "__all__"
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "user_type",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
        "updated_at",
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-created_at',)
    list_per_page = 25

    


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'designation', 'department', 'experience_years', 'created_at')
    list_filter = ('designation', 'department')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'employee_id')
    autocomplete_fields = ['user', 'department']
    list_per_page = 25
    readonly_fields = ('created_at', 'updated_at')


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'registration_number', 'section', 'admission_year', 'current_semester', 'cgpa', 'is_active')
    list_filter = ('academic_status', 'enrollment_status', 'is_active', 'section', 'admission_year')
    search_fields = ('registration_number', 'user__email', 'user__first_name', 'user__last_name')
    autocomplete_fields = ['user', 'section', 'created_by', 'updated_by']
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'date_of_joining', 'is_active')
    list_filter = ('department', 'is_active')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    autocomplete_fields = ['user', 'department', 'created_by', 'updated_by']
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25
