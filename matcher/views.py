from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FoundItemSerializer, LostItemSerializer
from .services import generate_embedding
from pgvector.django import CosineDistance
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

            location_lost = request.data.get('location_lost', '')

            vector = generate_embedding(description)
            serializer.save()

            matches = FoundItem.objects.annotate(
                distance=CosineDistance('embedding', vector)
            ).filter(
                date_found__gte=date_last_seen,
                distance__lt=0.6
            ).order_by('distance')[:5]

            match_data = []
            for match in matches:
                item_data = FoundItemSerializer(match).data

                similarity = (1 - match.distance) * 100
                # print("similarity", similarity)
                if location_lost and getattr(match, 'location_found', '') == location_lost:
                    similarity += 10
                # print("similarity", similarity, 'after', location_lost,getattr(match, 'location_found', '') )

                item_data['score'] = min(round(similarity), 99)
                match_data.append(item_data)

            match_data = sorted(match_data, key=lambda x: x['score'], reverse=True)

            return Response({
                "message": "Search complete.",
                "matches": match_data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)