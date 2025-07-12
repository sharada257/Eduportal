from django.contrib import admin
from .models import Department, Section, Subject,Semester, CourseAssignment

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department_name', 'short_name', 'total_faculty_count', 'current_student_count', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('department_name', 'short_name')
    list_per_page = 25  # Pagination

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ( 'section_name', 'department', 'semester', 'batch_year', 'capacity', 'is_active')
    list_filter = ( 'semester', 'is_active', 'department')
    search_fields = ( 'section_name',)
    autocomplete_fields = ['department']
    list_per_page = 25  # Pagination

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject_code', 'subject_name', 'department', 'semester', 'is_open_elective', 'credits', 'is_active')
    list_filter = ('is_open_elective', 'semester', 'is_active', 'department')
    search_fields = ('subject_code', 'subject_name')
    autocomplete_fields = ['department']
    list_per_page = 25  # Pagination

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = (
        'semester_number', 
        'name', 
        'department', 
        'academic_year', 
        'start_date', 
        'end_date', 
        'is_active'
    )
    list_filter = (
        'department', 
        'academic_year', 
        'is_active'
    )
    search_fields = (
        'name', 
        'academic_year', 
        'department__name'
    )
    ordering = ('start_date',)

@admin.register(CourseAssignment)
class CourseAssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'teacher', 'subject', 'semester', 'section')
    search_fields = ('teacher__user__first_name', 'teacher__user__email', 'subject__subject_name')
    list_filter = ('semester', 'section')
