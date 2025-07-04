from django.contrib import admin
from django.core.exceptions import ValidationError
from .models import Assignment, Quiz, Test, Submission, SubjectTeacherSection

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'teacher', 'section', 'due_date', 'is_active')
    list_filter = ('subject', 'teacher', 'section', 'is_active')
    search_fields = ('title', 'description')
    autocomplete_fields = ['subject', 'teacher', 'section']
    list_per_page = 25


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'teacher', 'section', 'total_marks', 'is_active')
    list_filter = ('subject', 'teacher', 'section', 'is_active')
    search_fields = ('title',)
    autocomplete_fields = ['subject', 'teacher', 'section']
    list_per_page = 25


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'teacher', 'section', 'scheduled_date', 'total_marks', 'is_active')
    list_filter = ('subject', 'teacher', 'section', 'is_active')
    search_fields = ('title',)
    autocomplete_fields = ['subject', 'teacher', 'section']
    list_per_page = 25


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'type', 'submitted_at', 'is_evaluated', 'obtained_marks')
    list_filter = ('type', 'is_evaluated')
    search_fields = ('student__user__email', 'type')
    autocomplete_fields = ['student', 'assignment', 'quiz', 'test']
    list_per_page = 25

    def save_model(self, request, obj, form, change):
        try:
            obj.clean()
            super().save_model(request, obj, form, change)
        except ValidationError as e:
            form.add_error(None, e)


@admin.register(SubjectTeacherSection)
class SubjectTeacherSectionAdmin(admin.ModelAdmin):
    list_display = ('subject', 'teacher', 'section', 'created_at', 'is_active')
    list_filter = ('subject', 'teacher', 'section', 'is_active')
    search_fields = ('subject__subject_code', 'teacher__user__email', 'section__section_code')
    autocomplete_fields = ['subject', 'teacher', 'section']
    list_per_page = 25
