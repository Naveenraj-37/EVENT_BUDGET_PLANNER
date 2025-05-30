from rest_framework import serializers
from .models import UserProfile, Service, ServicePackage, Event, PackageBooking
from django.contrib.auth.hashers import make_password, check_password
import random
import string

def generate_username_somehow(data):
    base = data.get('name', 'user').replace(' ', '').lower()
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    return f"{base}_{suffix}"

class UserProfileSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'password', 'confirm_password', 'username']
        read_only_fields = ['username']
        extra_kwargs = {'password': {'write_only': True}}
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        validated_data['username'] = generate_username_somehow(validated_data)
        user = UserProfile(**validated_data)
        user.password = make_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    user = None
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        try:
            user = UserProfile.objects.get(username=username)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password.")
        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid username or password.")
        self.user = user
        data['user'] = user
        return data

class ServicePackageSerializer(serializers.ModelSerializer):
    sample_image = serializers.ImageField(use_url=True, required=False)
    class Meta:
        model = ServicePackage
        fields = ['id', 'service', 'title', 'description', 'items', 'cost', 'sample_image']

class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Service
        fields = ['id', 'name', 'image']

class ServiceWithPackagesSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    packages = ServicePackageSerializer(many=True, read_only=True)
    class Meta:
        model = Service
        fields = ['id', 'name', 'image', 'packages']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'user', 'event_name', 'event_date', 'budget', 'contact_no', 'status']
        extra_kwargs = {
            'user': {'required': True},
            'event_name': {'required': True},
            'event_date': {'required': True},
            'budget': {'required': True},
            'contact_no': {'required': True},
            'status': {'required': False}  # Optional, defaults to 'confirmed'
        }
    def validate_event_date(self, value):
        if value < datetime.date.today():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value

class PackageBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageBooking
        fields = ['id', 'event', 'package', 'quantity', 'service', 'total_cost']
    def validate(self, data):
        package = data.get('package')
        quantity = data.get('quantity')
        if not package or not quantity:
            raise serializers.ValidationError("Package and quantity are required.")
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be positive.")
        # Calculate total_cost to ensure consistency
        data['total_cost'] = package.cost * quantity
        return data
    def create(self, validated_data):
        return super().create(validated_data)