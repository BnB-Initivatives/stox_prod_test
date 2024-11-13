import logging
from typing import Annotated
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from fastapi.security import OAuth2PasswordRequestForm
from app.db.base import get_db
from app.core.config import settings
from app.core.security import authenticate_user, create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])

db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/submit")
async def submit_form(
    username: str = Form(...),  # Use Form to receive form data
    user_id: int = Form(...),  # Assuming user_id is an integer
):
    # Implement your logic, e.g., save to a database or process the data
    return {"detail": "OK", "username": username, "user_id": user_id}


@router.post(
    "/token"
)  # full route will be /auth/token matching the tokenUrl of OAuth2PasswordBearer
async def get_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
):
    try:
        print(form_data)
        user = await authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Could not validate the user with username {form_data.username}.",
            )
        token = await create_access_token(user.user_name, user.user_id)  # type: ignore

        return {"access_token": token, "token_type": settings.ACCESS_TOKEN_TYPE}

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while authenticating the user with username {form_data.username}.",
        )
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail,
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        logging.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while authenticating the user with username {form_data.username}.",
        )
