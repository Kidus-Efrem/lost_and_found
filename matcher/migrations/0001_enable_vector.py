from django.db import migrations
from pgvector.django import VectorExtension

class Migration(migrations.Migration):

    # Empty dependencies so this runs first
    dependencies = []

    operations = [
        VectorExtension(),
    ]