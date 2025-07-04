from django.contrib import admin
from .models import Department, Section, Subject

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department_name', 'short_name', 'total_faculty_count', 'current_student_count', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('department_name', 'short_name')
    list_per_page = 25  # Pagination

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ( 'section_name', 'department', 'current_semester', 'academic_year', 'batch_year', 'capacity', 'is_active')
    list_filter = ('academic_year', 'current_semester', 'is_active', 'department')
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
