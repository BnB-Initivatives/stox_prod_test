from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette import status
from app.core.config import settings
from app.db.models.rbac import User
from app.db.base import get_db
from app.services.user_service import UserService


db_dependency = Annotated[Session, Depends(get_db)]


def authenticate_user(username: str, password: str, db: db_dependency):
    # Fetch the user from DB
    stmt = select(User).where(User.user_name == username)
    user_model = db.execute(stmt).scalars().first()
    # Check if user exists and is enabled
    if user_model is None:
        return False
    if not user_model.enabled:
        return False

    # Verify credentials against DB
    # if not settings.bcrypt_context.verify(password, user_model.hashed_password):  # type: ignore
    if not UserService().check_password(user_model, password):
        return False

    return user_model


def create_access_token(
    username: str,
    user_id: int,
    expires_delta: Optional[timedelta] = None,
    remember_me: bool = False,
):
    encode = {"sub": username, "id": user_id}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    elif remember_me:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.ACCESS_TOKEN_EXPIRE_DAYS_WITH_REMEMBER_ME
        )
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    encode.update({"exp": expire})

    return jwt.encode(encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_current_user(
    token: Annotated[str, Depends(settings.oauth2_bearer)], db: db_dependency
):
    try:
        # Retrieve details from jwt token payload
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        user_id: int = payload.get("id")

        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user.",
            )
        # Verify user against DB
        stmt = select(User).where(User.user_name == username)
        user_model = db.execute(stmt).scalars().first()

        if user_model is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user.",
            )

        return user_model

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user."
        )


def check_permissions(required_permission: str):
    """
    Check if the current user has the required permission.

    Args:
        required_permission (str): The permission required to perform an action.

    Returns:
        function: A permission checker function that raises an HTTPException if the user lacks the required permission.
    """

    def permission_checker(user: User = Depends(get_current_user)):
        if not any(
            permission.name == required_permission
            for role in user.roles
            for permission in role.permissions
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted because of insufficient permissions",
            )

    return permission_checker
