from rest_framework import serializers
from .models import Department, Semester, Section, Subject


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    
    class Meta:
        model = Department
        fields = [
            'id', 'department_name', 'short_name', 'total_faculty_count',
            'total_student_capacity', 'current_student_count', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_department_name(self, value):
        """Validate department name is not empty and unique"""
        if not value.strip():
            raise serializers.ValidationError("Department name cannot be empty")
        
        # Check for uniqueness (excluding current instance for updates)
        instance = getattr(self, 'instance', None)
        queryset = Department.objects.filter(
            department_name__iexact=value,
            deleted_at__isnull=True
        )
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Department with this name already exists")
        
        return value

    def validate_total_faculty_count(self, value):
        """Validate faculty count is not negative"""
        if value < 0:
            raise serializers.ValidationError("Faculty count cannot be negative")
        return value

    def validate_total_student_capacity(self, value):
        """Validate student capacity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Student capacity must be positive")
        return value

    def validate_current_student_count(self, value):
        """Validate current student count is not negative"""
        if value < 0:
            raise serializers.ValidationError("Current student count cannot be negative")
        return value

    def validate(self, data):
        """Cross-field validation"""
        current_count = data.get('current_student_count', 0)
        capacity = data.get('total_student_capacity', 0)
        
        if current_count > capacity:
            raise serializers.ValidationError(
                "Current student count cannot exceed total capacity"
            )
        
        return data


class SemesterSerializer(serializers.ModelSerializer):
    """Serializer for Semester model"""
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = Semester
        fields = [
            'id', 'semester_number', 'name', 'department', 'department_name',
            'academic_year', 'start_date', 'end_date', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'department_name']

    def validate_semester_number(self, value):
        """Validate semester number is within valid range"""
        if value < 1 or value > 8:
            raise serializers.ValidationError("Semester number must be between 1 and 8")
        return value

    def validate_academic_year(self, value):
        """Validate academic year format"""
        if not value or len(value) < 7:
            raise serializers.ValidationError("Academic year must be in format YYYY-YY")
        return value

    def validate(self, data):
        """Cross-field validation"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError(
                "Start date must be before end date"
            )
        
        return data


class SectionSerializer(serializers.ModelSerializer):
    """Serializer for Section model"""
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    semester_name = serializers.CharField(source='semester.name', read_only=True)
    
    class Meta:
        model = Section
        fields = [
            'id', 'section_name', 'department', 'department_name', 'semester',
            'semester_name', 'batch_year', 'capacity', 'max_capacity',
            'academic_status', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'department_name', 'semester_name']

    def validate_section_name(self, value):
        """Validate section name is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Section name cannot be empty")
        return value

    def validate_batch_year(self, value):
        """Validate batch year is reasonable"""
        from datetime import datetime
        current_year = datetime.now().year
        if value < 2000 or value > current_year + 5:
            raise serializers.ValidationError(
                f"Batch year must be between 2000 and {current_year + 5}"
            )
        return value

    def validate_capacity(self, value):
        """Validate capacity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Capacity must be positive")
        return value

    def validate_max_capacity(self, value):
        """Validate max capacity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Max capacity must be positive")
        return value

    def validate(self, data):
        """Cross-field validation"""
        capacity = data.get('capacity', 0)
        max_capacity = data.get('max_capacity', 0)
        
        if capacity > max_capacity:
            raise serializers.ValidationError(
                "Capacity cannot exceed maximum capacity"
            )
        
        return data


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model"""
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    semester_name = serializers.CharField(source='semester.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = [
            'id', 'subject_code', 'subject_name', 'description', 'credits',
            'is_open_elective', 'department', 'department_name', 'semester',
            'semester_name', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'department_name', 'semester_name']

    def validate_subject_code(self, value):
        """Validate subject code format and uniqueness"""
        if not value.strip():
            raise serializers.ValidationError("Subject code cannot be empty")
        
        # Check for uniqueness (excluding current instance for updates)
        instance = getattr(self, 'instance', None)
        queryset = Subject.objects.filter(subject_code__iexact=value)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Subject with this code already exists")
        
        return value.upper()  # Store in uppercase

    def validate_subject_name(self, value):
        """Validate subject name is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Subject name cannot be empty")
        return value

    def validate_credits(self, value):
        """Validate credits is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Credits cannot be negative")
        if value > 10:
            raise serializers.ValidationError("Credits cannot exceed 10")
        return value


# Additional serializers for nested responses
class SubjectListSerializer(serializers.ModelSerializer):
    """Simplified serializer for subject lists"""
    
    class Meta:
        model = Subject
        fields = ['id', 'subject_code', 'subject_name', 'credits', 'is_open_elective']


class SectionSubjectSerializer(serializers.ModelSerializer):
    """Serializer for section with its subjects"""
    subjects = SubjectListSerializer(source='semester.subjects', many=True, read_only=True)
    
    class Meta:
        model = Section
        fields = ['id', 'section_name', 'subjects']