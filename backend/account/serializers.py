# app/serializers.py
from rest_framework import serializers
from .models import User
from .models import StudentProfile, AdminProfile
from .models import TeacherProfile, User




class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['id', 'created_at', 'updated_at']

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type']


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'


class TeacherProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class TeacherProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        exclude = ['id', 'created_at']

class TeacherProfileDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = TeacherProfile
        fields = '__all__'

class TeacherProfileListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['id', 'employee_id', 'designation', 'qualification', 'experience_years']

class TeacherProfileAPIResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    message = serializers.CharField()
    data = TeacherProfileDetailSerializer()

from .models import StudentProfile


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class StudentProfileListSerializer(serializers.ModelSerializer):
    semester_number = serializers.SerializerMethodField()
    user = userSerializer()
    section = serializers.StringRelatedField()
    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'registration_number', 'admission_year', 'semester', 'academic_status', 'semester_number']

    def get_semester_number(self, obj):
        if obj.semester:
            return obj.semester.semester_number
        return None

class StudentProfileDetailSerializer(serializers.ModelSerializer):
    semester_number = serializers.SerializerMethodField()
    user = userSerializer()
    section = serializers.StringRelatedField()
    class Meta:
        model = StudentProfile
        fields = ['id', 'user',"section",'registration_number', 'admission_year', 'semester', 'semester_number', "batch_year","program_type","cgpa","sgpa_current","total_credits_completed","total_credits_required",'academic_status']

    def get_semester_number(self, obj):
        if obj.semester:
            return obj.semester.semester_number
        return None
    
class StudentProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        exclude = ['created_at', 'updated_at', 'updated_by']



class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    user = UserUpdateSerializer()

    class Meta:
        model = StudentProfile
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        # Update StudentProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related User fields
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        return instance

class AdminProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    department = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()
    updated_by = serializers.StringRelatedField()

    class Meta:
        model = AdminProfile
        fields = '__all__'
