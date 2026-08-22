from django.urls import path
from .views import SubmitFoundItemView, SearchLostItemView

urlpatterns = [
    path('api/found/', SubmitFoundItemView.as_view(), name='submit-found-item'),
    path('api/lost/', SearchLostItemView.as_view(), name='search-lost-item'),
]