from django.urls import path
from .views import TripDeleteView, TripListCreateView, TripDetailView, LogEntryListCreateView

urlpatterns = [
    path('trips/', TripListCreateView.as_view(), name='trip-list-create'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
    path('trips/<int:pk>/delete/', TripDeleteView.as_view(), name='trip-delete'),  # Add this line
    path('log-entries/', LogEntryListCreateView.as_view(), name='log-entry-list-create'),
]