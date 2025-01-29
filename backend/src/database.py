import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.todo_app
collection = db.todos
