from django.urls import path
from .views import (
    UserSignupView, LoginView, UserListView,
    AddServiceView, ViewServices,
    AddServicePackageView,
    EventSubmitView,
    EventListView,
    event_receipt_data,
    ServicesWithPackagesView,
    ServicePackageListView,
    PackageBookingCreateView
)

urlpatterns = [
    path('signup/', UserSignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('users/', UserListView.as_view()),
    path('services/add/', AddServiceView.as_view()),
    path('api/event/<int:event_id>/receipt/', event_receipt_data, name='event-receipt'),
    path('services/', ViewServices.as_view()),
    path('services-with-packages/', ServicesWithPackagesView.as_view(), name='services-with-packages'),
    path('packages/add/', AddServicePackageView.as_view()),
    path('packages/', ServicePackageListView.as_view()),
    path('api/events/', EventSubmitView.as_view(), name='event-submit'),  # Changed from 'events/submit/' to 'api/events/'
    path('event-services/', EventListView.as_view(), name='event-services'),
    path('api/package-bookings/', PackageBookingCreateView.as_view(), name='package-booking-create'),
]