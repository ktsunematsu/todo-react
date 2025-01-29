from datetime import datetime

from databases import Database
from sqlalchemy import Boolean, Column, DateTime, Integer, MetaData, String, Table, create_engine

# SQLiteデータベースのURL
DATABASE_URL = "sqlite:///./todo.db"

# データベース接続
database = Database(DATABASE_URL)

# メタデータ
metadata = MetaData()

# TODOテーブル定義
todos = Table(
    "todos",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("text", String, nullable=False),
    Column("completed", Boolean, default=False),
    Column("created_at", DateTime, default=datetime.now),
    Column("updated_at", DateTime, default=datetime.now, onupdate=datetime.now),
)

# データベースエンジン
engine = create_engine(DATABASE_URL)

# テーブル作成
metadata.create_all(engine)
