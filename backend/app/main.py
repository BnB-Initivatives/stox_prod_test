from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.base import engine
from app.api.v1 import users, roles, permissions, auth
from app.core.config import settings


app = FastAPI()

# Allow requests from the React frontend
origins = [
    "http://localhost:3000",  # React app running in the browser
    "http://localhost:8000",  # Your backend if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def index():
    return {"message": "Welcome to my API !!!"}


@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(permissions.router)
app.include_router(users.user_role)
app.include_router(roles.role_permission)
