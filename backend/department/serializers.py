import logging
from rest_framework import serializers
from .models import Department, Section, Subject, Semester

logger = logging.getLogger(__name__)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'id',
            'department_name',
            'short_name',
            'is_active'
        ]

    def to_representation(self, instance):
        try:
            return super().to_representation(instance)
        except Exception as e:
            logger.exception(f"Error serializing Department {instance.id if instance else 'N/A'}: {e}")
            raise serializers.ValidationError("Internal error serializing department data.")


class SectionSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField(read_only=True)
    semester_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Section
        fields = [
            'id',
            'section_name',
            'department_name',    # computed field from get_department_name()
            'semester',           # shows semester UUID by default
            'semester_display'    # shows human-readable semester info
        ]

    def get_department_name(self, obj):
        if obj.department:
            return obj.department.department_name
        return None

    def get_semester_display(self, obj):
        if obj.semester:
            return f"Sem {obj.semester.semester_number} ({obj.semester.academic_year})"
        return None

    def to_representation(self, instance):
        try:
            return super().to_representation(instance)
        except Exception as e:
            logger.exception(f"Error serializing Section {instance.id if instance else 'N/A'}: {e}")
            raise serializers.ValidationError("Internal error serializing section data.")


class SubjectSerializer(serializers.ModelSerializer):
    department_name = serializers.SerializerMethodField(read_only=True)
    semester_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = [
            'id',
            'subject_name',
            'subject_code',
            'credits',
            'department',
            'department_name',
            'semester',
            'semester_display',
            'is_open_elective'
        ]

    def get_department_name(self, obj):
        if obj.department:
            return obj.department.department_name
        return None

    def get_semester_display(self, obj):
        if obj.semester:
            return f"Sem {obj.semester.semester_number} ({obj.semester.academic_year})"
        return None

    def validate_credits(self, value):
        if value < 0:
            logger.warning(f"Invalid credits value: {value}")
            raise serializers.ValidationError("Credits cannot be negative.")
        return value

    def to_representation(self, instance):
        try:
            return super().to_representation(instance)
        except Exception as e:
            logger.exception(f"Error serializing Subject {instance.id if instance else 'N/A'}: {e}")
            raise serializers.ValidationError("Internal error serializing subject data.")
