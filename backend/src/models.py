from datetime import datetime

from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    text: str
    completed: bool = False


class Todo(TodoCreate):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
