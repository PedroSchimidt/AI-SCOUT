import os

# Set before app.config is imported. Tests must not create ai_scout.db on disk.
os.environ["DATABASE_URL"] = "sqlite://"
