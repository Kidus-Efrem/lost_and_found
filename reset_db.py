import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

# Drop the tables and clear the migration history
with connection.cursor() as cursor:
    cursor.execute("DROP TABLE IF EXISTS matcher_founditem CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS matcher_lostitem CASCADE;")
    cursor.execute("DELETE FROM django_migrations WHERE app='matcher';")

print("Test tables successfully cleared! Ready to migrate.")