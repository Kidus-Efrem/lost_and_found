from django.db import models
from pgvector.django import VectorField

class FoundItem(models.Model):
    STATUS_CHOICES = [
        ('AT_DESK', 'Dropped off at a campus desk'),
        ('WITH_FINDER', 'Held by finder')
    ]

    description = models.TextField()
    date_found = models.DateField()

    # Branching logic fields
    holding_status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    location_details = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)

    # The Semantic Vector
    embedding = VectorField(dimensions=384, blank=True, null=True)

class LostItem(models.Model):
    description = models.TextField()
    date_last_seen = models.DateField()