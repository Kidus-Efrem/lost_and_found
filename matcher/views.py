from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FoundItemSerializer
from .services import generate_embedding
from pgvector.django import CosineDistance
from .serializers import LostItemSerializer
from .models import FoundItem

class SubmitFoundItemView(APIView):
    def post(self, request):
        serializer = FoundItemSerializer(data=request.data)

        if serializer.is_valid():
            description = serializer.validated_data['description']
            vector = generate_embedding(description)
            serializer.save(embedding=vector)

            return Response(
                {"message": "Item successfully reported.", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SearchLostItemView(APIView):
    def post(self, request):
        serializer = LostItemSerializer(data=request.data)

        if serializer.is_valid():
            description = serializer.validated_data['description']
            date_last_seen = serializer.validated_data['date_last_seen']

            vector = generate_embedding(description)
            serializer.save()

            matches = FoundItem.objects.filter(
                date_found__gte=date_last_seen
            ).order_by(
                CosineDistance('embedding', vector)
            )[:5]

            match_data = FoundItemSerializer(matches, many=True).data

            return Response({
                "message": "Search complete.",
                "matches": match_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)