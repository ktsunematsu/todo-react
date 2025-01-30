from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TodoCreate(BaseModel):
    text: str
    completed: bool = False
    alert: bool = False
    limit_date: Optional[datetime] = None


class Todo(TodoCreate):
    id: int
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        from_attributes = True
