from unittest.mock import patch

import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def mock_embedding():
    with patch('matcher.views.generate_embedding') as mock:
        mock.return_value = [0.1] * 384
        yield mock

@pytest.mark.django_db
def test_submit_found_item(api_client, mock_embedding):
    url = reverse('submit-found-item')
    data = {
        "description": "Black AirPods case",
        "date_found": "2026-08-20",
        "holding_status": "AT_DESK",
        "location_details": "Main Library"
    }
    response = api_client.post(url, data, format='json')

    assert response.status_code == 201
    assert mock_embedding.called

@pytest.mark.django_db
def test_search_lost_item(api_client, mock_embedding):
    url = reverse('search-lost-item')
    data = {
        "description": "Lost my black AirPods",
        "date_last_seen": "2026-08-19"
    }
    response = api_client.post(url, data, format='json')

    assert response.status_code == 200
    assert mock_embedding.called