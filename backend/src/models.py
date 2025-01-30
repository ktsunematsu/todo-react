from datetime import datetime

from pydantic import BaseModel


class TodoCreate(BaseModel):
    text: str
    completed: bool = False


class Todo(TodoCreate):
    id: int
    alert: bool
    limit_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
