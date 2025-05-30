from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from .models import UserProfile, Service, ServicePackage, Event, PackageBooking
from .serializers import (
    UserProfileSerializer,
    LoginSerializer,
    ServiceSerializer,
    ServicePackageSerializer,
    ServiceWithPackagesSerializer,
    EventSerializer,
    PackageBookingSerializer,
)

class UserSignupView(APIView):
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'User registered successfully',
                'username': serializer.data.get('username')
            }, status=status.HTTP_201_CREATED)
        print("Signup failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                'message': 'Login successful',
                'username': user.username
            }, status=status.HTTP_200_OK)
        print("Login failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(APIView):
    def get(self, request):
        users = UserProfile.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddServiceView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Service added successfully',
                'service': serializer.data
            }, status=status.HTTP_201_CREATED)
        print("Service creation failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ViewServices(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddServicePackageView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        serializer = ServicePackageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Service package added successfully',
                'package': serializer.data
            }, status=status.HTTP_201_CREATED)
        print("Service package creation failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServicePackageListView(generics.ListAPIView):
    queryset = ServicePackage.objects.all()
    serializer_class = ServicePackageSerializer

class EventSubmitView(APIView):
    def post(self, request):
        username = request.data.get('username')
        try:
            user = UserProfile.objects.get(username=username)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        event_data = {
            'user': user.id,
            'event_name': request.data.get('event_name'),
            'event_date': request.data.get('event_date'),
            'budget': request.data.get('budget'),
            'contact_no': request.data.get('contact_no'),
            'status': request.data.get('status', 'confirmed'),  # Added status
        }
        serializer = EventSerializer(data=event_data)
        if serializer.is_valid():
            event = serializer.save()
            return Response({'id': event.id, **serializer.data}, status=status.HTTP_201_CREATED)
        print("Event creation failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ServicesWithPackagesView(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceWithPackagesSerializer(services, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class PackageBookingCreateView(APIView):
    def post(self, request):
        serializer = PackageBookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Booking creation failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def event_receipt_data(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        package_bookings = PackageBooking.objects.filter(event=event).select_related('package', 'service')
        data = {
            'event': {
                'name': event.event_name,
                'date': event.event_date,
                'contact_no': event.contact_no,
                'initial_budget': float(event.budget),
                'used_budget': float(sum(b.total_cost for b in package_bookings)),
                'remaining_budget': float(event.budget - sum(b.total_cost for b in package_bookings)),
            },
            'user': {
                'name': event.user.username,  # Use username as name
                'email': event.user.email or '',
                'username': event.user.username,
            },
            'packages': [{
                'service_name': booking.service.name,
                'title': booking.package.title,
                'items': booking.package.items,
                'count': booking.quantity,
                'unit_cost': float(booking.package.cost),
                'total_cost': float(booking.total_cost)
            } for booking in package_bookings],
            'total_cost': float(sum(b.total_cost for b in package_bookings))
        }
        return Response(data)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)