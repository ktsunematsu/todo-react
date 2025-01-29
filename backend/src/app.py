from datetime import datetime
from typing import Sequence

from bson import ObjectId
from database import collection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Todo, TodoCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/todos", response_model=Sequence[Todo])
async def get_todos() -> Sequence[Todo]:
    todos = await collection.find().to_list(1000)
    return [Todo(**todo) for todo in todos]


@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate) -> Todo:
    new_todo = todo.dict()
    new_todo["created_at"] = datetime.now()
    new_todo["updated_at"] = datetime.now()
    result = await collection.insert_one(new_todo)
    created_todo = await collection.find_one({"_id": result.inserted_id})
    return Todo(**created_todo)


@app.put("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo: TodoCreate) -> Todo:
    result = await collection.update_one(
        {"_id": ObjectId(todo_id)},
        {"$set": {"text": todo.text, "completed": todo.completed, "updated_at": datetime.now()}},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    updated_todo = await collection.find_one({"_id": ObjectId(todo_id)})
    return Todo(**updated_todo)


@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: str) -> dict[str, str]:
    result = await collection.delete_one({"_id": ObjectId(todo_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}
