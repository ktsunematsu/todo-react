import os
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.database import database, todos  # srcディレクトリからの相対インポート
from src.models import Todo, TodoCreate  # srcディレクトリからの相対インポート


async def init_db():
    print("Checking database...")
    # レコードの存在確認
    query = todos.select()
    existing_records = await database.fetch_all(query)

    if existing_records:
        print("Database already initialized.")
        return

    print("Initializing database...")
    sql_file = os.path.join(os.path.dirname(__file__), "..", "migrations", "todo_init.sql")
    if os.path.exists(sql_file):
        with open(sql_file) as f:
            sql = f.read()
            statements = [s.strip() for s in sql.split(";") if s.strip()]
            for statement in statements:
                try:
                    await database.execute(statement)
                except Exception as e:
                    print(f"Error executing SQL: {e}")
                    print(f"Statement: {statement}")
            print("Database initialized with todo_init.sql")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup event
    print("Starting up...")
    await database.connect()
    await init_db()  # 追加
    yield
    # shutdown event
    print("Shutting down...")
    await database.disconnect()


app = FastAPI(lifespan=lifespan)

# 静的ファイルの設定
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/todos", response_model=list[Todo])
async def get_todos() -> list[Todo]:
    """
    全てのTODOアイテムを取得します。

    Returns:
        list[Todo]: TODOアイテムのリスト
    """
    query = todos.select()
    records = await database.fetch_all(query)
    return [
        Todo(
            id=record["id"],
            text=record["text"],
            completed=record["completed"],
            alert=record["alert"],
            limit_date=record["limit_date"],
            created_at=record["created_at"] or datetime.now(),
            updated_at=record["updated_at"] or datetime.now(),
        )
        for record in records
    ]


@app.get("/api/todos/{todo_id}", response_model=Todo)
async def get_todo_by_id(todo_id: int) -> Todo:
    query = todos.select().where(todos.c.id == todo_id)
    record = await database.fetch_one(query)

    if not record:
        raise HTTPException(status_code=404, detail="Todo not found")

    return Todo(
        id=record["id"],
        text=record["text"],
        completed=record["completed"],
        alert=record["alert"],
        limit_date=record["limit_date"],
        created_at=record["created_at"] or datetime.now(),
        updated_at=record["updated_at"] or datetime.now(),
    )


@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate) -> dict:
    """
    新しいTODOアイテムを作成します。

    Args:
        todo (TodoCreate): 作成するTODOアイテムのデータ

    Returns:
        Todo: 作成されたTODOアイテム

    Raises:
        HTTPException: データベースエラー時に発生
    """
    query = todos.insert().values(
        text=todo.text,
        completed=todo.completed,
        alert=todo.alert,
        limit_date=todo.limit_date,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    last_record_id = await database.execute(query)
    return {**todo.dict(), "id": last_record_id}


@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo: TodoCreate) -> dict:
    """
    指定されたTODOアイテムを更新します。

    Args:
        todo_id (int): 更新するTODOアイテムのID
        todo (TodoCreate): 更新するデータ

    Returns:
        Todo: 更新されたTODOアイテム

    Raises:
        HTTPException: TODOアイテムが見つからない場合やデータベースエラー時に発生
    """
    query = (
        todos.update()
        .where(todos.c.id == todo_id)
        .values(text=todo.text, completed=todo.completed, updated_at=datetime.now())
    )
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {**todo.dict(), "id": todo_id}


@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: int) -> dict:
    query = todos.delete().where(todos.c.id == todo_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}


@app.get("/")
async def root():
    return JSONResponse({"message": "Welcome to TODO API", "docs": "/docs", "endpoints": {"todos": "/api/todos"}})
