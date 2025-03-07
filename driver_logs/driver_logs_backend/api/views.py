from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class TripDetailView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class TripDeleteView(APIView):
    def delete(self, request, pk, format=None):
        try:
            trip = Trip.objects.get(pk=pk)
            trip.delete()
            return Response(status=status.HTTP_204_NO_CONTENT) 
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

class LogEntryListCreateView(generics.ListCreateAPIView):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer