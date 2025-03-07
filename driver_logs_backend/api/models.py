from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.IntegerField()

class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, related_name="logs", on_delete=models.CASCADE)
    stop_location = models.CharField(max_length=255)
    driving_hours = models.IntegerField()
    rest_hours = models.IntegerField()
