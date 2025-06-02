from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser  # Import CustomUser instead of User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # Use CustomUser
        fields = ['username', 'email', 'password', 'age', 'gender']

    def validate(self, data):
        if CustomUser.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username is already taken'})
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already registered'})
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)  # Use create_user() for password hashing
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        # Authenticate the user
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            # If user is found and is active, return the user object
            return user
        raise serializers.ValidationError('Incorrect Credentials')
    
class HealthDataSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        slug_field='id',  # Match user by username instead of ID
        queryset=CustomUser.objects.all()
    )

    class Meta:
        model = HealthData
        fields = "__all__"
