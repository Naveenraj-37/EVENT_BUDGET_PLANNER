from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return HttpResponse("Home page is working")

urlpatterns = [
    path('', home),  # Root URL serving a simple home response
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # Include all app API routes under /api/
]

# Serve media files during development only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
