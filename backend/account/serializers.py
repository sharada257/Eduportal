from rest_framework import serializers
from .models import User
from .models import StudentProfile, AdminProfile
from .models import TeacherProfile, User
from department.models import Department


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class StudentProfileListSerializer(serializers.ModelSerializer):
    semester_number = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    section = serializers.CharField(source='section.section_name', read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['id', "first_name","last_name","email","section", 'registration_number', 'admission_year', 'semester', 'academic_status', 'semester_number']

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
        fields = ['user']  

    def update(self, instance, validated_data):
        user_data = validated_data.get('user')

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


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for teacher profile"""
    class Meta:
        model = User
        fields = ['id',"first_name","last_name",'email']


class DepartmentsSerializer(serializers.ModelSerializer):
    """Department info for teacher profile"""
    class Meta:
        model = Department
        fields = ['id', 'department_name']  # Adjust fields based on your Department model


class TeacherProfileListSerializer(serializers.ModelSerializer):
    """Serializer for listing teacher profiles"""
    user = UserBasicSerializer(read_only=True)
    department = DepartmentsSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'user', 'employee_id', 'designation', 
            'qualification', 'experience_years', 'department',
             'created_at', 'updated_at'
        ]


class TeacherProfileDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed teacher profile view"""
    user = UserBasicSerializer(read_only=True)
    department = DepartmentsSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'user', 'employee_id', 'designation', 
            'qualification', 'experience_years', 'department',
             'created_at', 'updated_at', 'joined_at', 
        ]


class TeacherProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating teacher profile"""
    user_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = [
            'user_id', 'employee_id', 'designation', 
            'qualification', 'experience_years', 'department',
            
        ]
    
    def validate_user_id(self, value):
        """Validate user exists and doesn't already have a teacher profile"""
        try:
            user = User.objects.get(id=value)
            if hasattr(user, 'teacherprofile'):
                raise serializers.ValidationError("User already has a teacher profile")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        return TeacherProfile.objects.create(user=user, **validated_data)


class TeacherProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating teacher profile"""
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = [
            "user"
        ]
    
    def validate_employee_id(self, value):
        """Validate employee_id is unique if provided"""
        if value and TeacherProfile.objects.filter(
            employee_id=value
        ).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Employee ID already exists")
        return value

from rest_framework import serializers

from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User  # adjust to your User model import

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    # def validate(self, data):
    #     email = data.get("email")
    #     password = data.get("password")

    #     # Check if a user with this email exists
    #     try:
    #         user = User.objects.get(email=email)
    #     except User.DoesNotExist:
    #         raise serializers.ValidationError("Invalid email or password.")

    #     # Check password
    #     if not user.check_password(password):
    #         raise serializers.ValidationError("Invalid email or password.")

    #     # Optional: check if user is active
    #     if not user.is_active:
    #         raise serializers.ValidationError("This account is inactive.")

        
    #     # Add the user to validated data
    #     data["user"] = user
    #     return data


