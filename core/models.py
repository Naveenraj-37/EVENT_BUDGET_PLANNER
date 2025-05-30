from django.db import models
import uuid
from decimal import Decimal

def generate_uuid():
    return str(uuid.uuid4())[:8]

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=50, unique=True, default=generate_uuid)
    def __str__(self):
        return self.username

class Service(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='services/')
    def __str__(self):
        return self.name

class ServicePackage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='packages')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    items = models.TextField(help_text="Enter a comma-separated list of items or features")
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    sample_image = models.ImageField(upload_to='packages/', blank=True, null=True)
    def __str__(self):
        return f"{self.service.name} - {self.title}"

class Event(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='events')
    event_name = models.CharField(max_length=100)
    event_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    contact_no = models.CharField(max_length=10)
    status = models.CharField(max_length=20, default='confirmed')  # Added status
    def __str__(self):
        return f"{self.event_name} - {self.user.username}"

class PackageBooking(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    package = models.ForeignKey(ServicePackage, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.package.title} for {self.event.event_name}"