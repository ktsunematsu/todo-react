from datetime import datetime

from pydantic import BaseModel


class TodoCreate(BaseModel):
    text: str
    completed: bool = False


class Todo(TodoCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
