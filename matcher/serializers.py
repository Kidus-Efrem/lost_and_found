from rest_framework import serializers

from .models import FoundItem, LostItem


class FoundItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoundItem
        fields = ['id', 'description','location_found', 'date_found', 'holding_status', 'location_details', 'contact_email']

class LostItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LostItem
        fields = ['id', 'description', 'date_last_seen']