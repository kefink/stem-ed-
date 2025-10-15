from sqlalchemy import create_engine, inspect
from app.core.config import settings

# Convert async URL to sync for inspection
url = settings.DATABASE_URL.replace("mysql+aiomysql", "mysql+pymysql").replace("sqlite+aiosqlite", "sqlite")
engine = create_engine(url)
insp = inspect(engine)

print("=== Users Table Columns ===")
columns = insp.get_columns('users')
for col in columns:
    print(f"  - {col['name']}: {col['type']} (nullable={col['nullable']})")

print("\n=== Indexes ===")
indexes = insp.get_indexes('users')
for idx in indexes:
    print(f"  - {idx['name']}: {idx['column_names']}")
