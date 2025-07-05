import logging
from rest_framework import serializers
from .models import Department, Section, Subject

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
    department_name= serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Section
        fields = [
            'id',
            'section_name',
            'department_name',
            'semester',
        ]

    def get_department_name(self, obj):
        return obj.department.department_name


   
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            'id',
            'subject_name',
            'subject_code',
            'credits',
            'department',
            'is_open_elective'
        ]

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
