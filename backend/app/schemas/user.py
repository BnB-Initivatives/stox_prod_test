# Pydantic models for request/response validation, keep separate from database models

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .role import RoleReadRequest


class UserCreateRequest(BaseModel):
    user_name: str = Field(..., min_length=1, max_length=50)  # Required field
    password: str = Field(..., min_length=8)  # Required field
    enabled: bool = Field(default=True)  # Optional field with default value


class UserReadRequest(BaseModel):
    user_id: int
    user_name: str
    enabled: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    roles: list[RoleReadRequest] = (
        []
    )  # Nested RoleReadRequest models to include roles assigned to this user

    class Config:
        from_attributes = True  # Enables compatibility with SQLAlchemy models


class UserUpdateRequest(BaseModel):
    user_name: Optional[str] = Field(
        None, min_length=1, max_length=50
    )  # Optional field
    password: Optional[str] = Field(None, min_length=8)  # Optional field
    enabled: Optional[bool] = Field(None)  # Optional field
