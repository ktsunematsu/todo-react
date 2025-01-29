from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.database import database, todos  # srcディレクトリからの相対インポート
from src.models import Todo, TodoCreate  # srcディレクトリからの相対インポート

app = FastAPI()

# 静的ファイルの設定
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    await database.connect()


@app.on_event("shutdown")
async def shutdown() -> None:
    await database.disconnect()


@app.get("/api/todos", response_model=list[Todo])
async def get_todos() -> list[Todo]:
    query = todos.select()
    records = await database.fetch_all(query)
    return [
        Todo(
            id=record["id"],
            text=record["text"],
            completed=record["completed"],
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )
        for record in records
    ]


@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate) -> dict:
    query = todos.insert().values(
        text=todo.text, completed=todo.completed, created_at=datetime.now(), updated_at=datetime.now()
    )
    last_record_id = await database.execute(query)
    return {**todo.dict(), "id": last_record_id}


@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo: TodoCreate) -> dict:
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
