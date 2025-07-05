from rest_framework import serializers
from django.utils import timezone
from .models import Assignment, Quiz, Test, Submission, SubjectTeacherSection, SubmissionType
from account.models import TeacherProfile, StudentProfile
from department.models import Subject, Section


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer for Assignment model"""
    
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)
    section_name = serializers.CharField(source='section.section_name', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'title', 'subject', 'subject_name', 'subject_code',
            'teacher', 'teacher_name', 'section', 'section_name',
            'description', 'due_date', 'created_at', 'updated_at',
            'is_active', 'is_overdue', 'days_remaining'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_overdue(self, obj):
        """Check if assignment is overdue"""
        return obj.due_date < timezone.now()
    
    def get_days_remaining(self, obj):
        """Calculate days remaining for assignment"""
        if obj.due_date < timezone.now():
            return 0
        delta = obj.due_date - timezone.now()
        return delta.days
    
    def validate_due_date(self, value):
        """Validate due date is in future"""
        if value <= timezone.now():
            raise serializers.ValidationError("Due date must be in the future")
        return value


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model"""
    
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)
    section_name = serializers.CharField(source='section.section_name', read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'subject', 'subject_name', 'subject_code',
            'teacher', 'teacher_name', 'section', 'section_name',
            'total_marks', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_total_marks(self, value):
        """Validate total marks is positive"""
        if value <= 0:
            raise serializers.ValidationError("Total marks must be greater than 0")
        return value


class TestSerializer(serializers.ModelSerializer):
    """Serializer for Test model"""
    
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.first_name', read_only=True)
    section_name = serializers.CharField(source='section.section_name', read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    days_until_test = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = [
            'id', 'title', 'subject', 'subject_name', 'subject_code',
            'teacher', 'teacher_name', 'section', 'section_name',
            'scheduled_date', 'total_marks', 'created_at', 'updated_at',
            'is_active', 'is_upcoming', 'days_until_test'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_upcoming(self, obj):
        """Check if test is upcoming"""
        return obj.scheduled_date > timezone.now()
    
    def get_days_until_test(self, obj):
        """Calculate days until test"""
        if obj.scheduled_date < timezone.now():
            return 0
        delta = obj.scheduled_date - timezone.now()
        return delta.days
    
    def validate_scheduled_date(self, value):
        """Validate scheduled date is in future"""
        if value <= timezone.now():
            raise serializers.ValidationError("Test must be scheduled for future date")
        return value
    
    def validate_total_marks(self, value):
        """Validate total marks is positive"""
        if value <= 0:
            raise serializers.ValidationError("Total marks must be greater than 0")
        return value


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for Submission model"""
    
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    test_title = serializers.CharField(source='test.title', read_only=True)
    subject_name = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()
    total_marks = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()
    grade = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = [
            'id', 'assignment', 'quiz', 'test', 'student', 'type',
            'student_name', 'student_roll_number', 'assignment_title',
            'quiz_title', 'test_title', 'subject_name', 'subject_code',
            'submitted_at', 'is_evaluated', 'obtained_marks',
            'total_marks', 'percentage', 'grade', 'file_url'
        ]
        read_only_fields = ['id', 'submitted_at']
    
    def get_subject_name(self, obj):
        """Get subject name based on submission type"""
        if obj.assignment:
            return obj.assignment.subject.subject_name
        elif obj.quiz:
            return obj.quiz.subject.subject_name
        elif obj.test:
            return obj.test.subject.subject_name
        return None
    
    def get_subject_code(self, obj):
        """Get subject code based on submission type"""
        if obj.assignment:
            return obj.assignment.subject.subject_code
        elif obj.quiz:
            return obj.quiz.subject.subject_code
        elif obj.test:
            return obj.test.subject.subject_code
        return None
    
    def get_total_marks(self, obj):
        """Get total marks based on submission type"""
        if obj.quiz:
            return obj.quiz.total_marks
        elif obj.test:
            return obj.test.total_marks
        # For assignments, you might need to add total_marks field to Assignment model
        return None
    
    def get_percentage(self, obj):
        """Calculate percentage if both obtained and total marks are available"""
        if obj.obtained_marks is not None and obj.is_evaluated:
            total = self.get_total_marks(obj)
            if total and total > 0:
                return round((obj.obtained_marks / total) * 100, 2)
        return None
    
    def get_grade(self, obj):
        """Calculate grade based on percentage"""
        percentage = self.get_percentage(obj)
        if percentage is not None:
            if percentage >= 90:
                return 'A+'
            elif percentage >= 80:
                return 'A'
            elif percentage >= 70:
                return 'B+'
            elif percentage >= 60:
                return 'B'
            elif percentage >= 50:
                return 'C'
            elif percentage >= 40:
                return 'D'
            else:
                return 'F'
        return None
    
    def validate(self, data):
        """Validate submission data"""
        assignment = data.get('assignment')
        quiz = data.get('quiz')
        test = data.get('test')
        
        # Ensure exactly one of assignment, quiz, or test is provided
        filled_fields = [assignment, quiz, test]
        if sum(bool(field) for field in filled_fields) != 1:
            raise serializers.ValidationError(
                "Exactly one of assignment, quiz, or test must be provided"
            )
        
        # Validate submission type matches the provided object
        submission_type = data.get('type')
        if assignment and submission_type != SubmissionType.ASSIGNMENT.value:
            raise serializers.ValidationError(
                "Submission type must be 'assignment' when submitting assignment"
            )
        elif quiz and submission_type != SubmissionType.QUIZ.value:
            raise serializers.ValidationError(
                "Submission type must be 'quiz' when submitting quiz"
            )
        elif test and submission_type != SubmissionType.TEST.value:
            raise serializers.ValidationError(
                "Submission type must be 'test' when submitting test"
            )
        
        return data
    
    def validate_obtained_marks(self, value):
        """Validate obtained marks"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Obtained marks cannot be negative")
        return value


class SubjectTeacherSectionSerializer(serializers.ModelSerializer):
    """Serializer for SubjectTeacherSection model"""
    
    subject_name = serializers.CharField(source='subject.subject_name', read_only=True)
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)
    teacher_email = serializers.CharField(source='teacher.user.email', read_only=True)
    section_name = serializers.CharField(source='section.section_name', read_only=True)
    department_name = serializers.CharField(source='section.department.department_name', read_only=True)
    
    class Meta:
        model = SubjectTeacherSection
        fields = [
            'id', 'subject', 'subject_name', 'subject_code',
            'teacher', 'teacher_name', 'teacher_email',
            'section', 'section_name', 'department_name',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate unique combination of subject, teacher, and section"""
        subject = data.get('subject')
        teacher = data.get('teacher')
        section = data.get('section')
        
        # Check for existing active assignment (excluding current instance during updates)
        existing_query = SubjectTeacherSection.objects.filter(
            subject=subject,
            teacher=teacher,
            section=section,
            is_active=True
        )
        
        # Exclude current instance during updates
        if self.instance:
            existing_query = existing_query.exclude(pk=self.instance.pk)
        
        if existing_query.exists():
            raise serializers.ValidationError(
                "This subject-teacher-section combination already exists"
            )
        
        return data


# Additional serializers for specific use cases

class AssignmentSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for assignment summaries"""
    
    subject_code = serializers.CharField(source='subject.subject_code', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'subject_code', 'due_date', 'is_overdue']
    
    def get_is_overdue(self, obj):
        return obj.due_date < timezone.now()


class StudentSubmissionSummarySerializer(serializers.ModelSerializer):
    """Serializer for student submission summaries"""
    
    item_title = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = [
            'id', 'type', 'item_title', 'subject_code',
            'submitted_at', 'is_evaluated', 'obtained_marks'
        ]
    
    def get_item_title(self, obj):
        """Get title based on submission type"""
        if obj.assignment:
            return obj.assignment.title
        elif obj.quiz:
            return obj.quiz.title
        elif obj.test:
            return obj.test.title
        return None
    
    def get_subject_code(self, obj):
        """Get subject code based on submission type"""
        if obj.assignment:
            return obj.assignment.subject.subject_code
        elif obj.quiz:
            return obj.quiz.subject.subject_code
        elif obj.test:
            return obj.test.subject.subject_code
        return None


class TeacherSectionSubjectSerializer(serializers.ModelSerializer):
    """Serializer for teacher's section and subject combinations"""
    
    sections = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    
    class Meta:
        model = TeacherProfile
        fields = ['id', 'user', 'sections', 'subjects']
    
    def get_sections(self, obj):
        """Get all sections assigned to this teacher"""
        assignments = SubjectTeacherSection.objects.filter(
            teacher=obj, 
            is_active=True
        ).select_related('section')
        
        sections = []
        for assignment in assignments:
            section_data = {
                'id': assignment.section.id,
                'name': assignment.section.section_name,
                'department': assignment.section.department.department_name
            }
            if section_data not in sections:
                sections.append(section_data)
        
        return sections
    
    def get_subjects(self, obj):
        """Get all subjects assigned to this teacher"""
        assignments = SubjectTeacherSection.objects.filter(
            teacher=obj, 
            is_active=True
        ).select_related('subject')
        
        subjects = []
        for assignment in assignments:
            subject_data = {
                'id': assignment.subject.id,
                'name': assignment.subject.subject_name,
                'code': assignment.subject.subject_code
            }
            if subject_data not in subjects:
                subjects.append(subject_data)
        
        return subjects