import logging
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import get_current_user
from app.db.models.rbac import Permission
from app.db.base import get_db
from app.schemas.permission import (
    PermissionCreateRequest,
    PermissionReadRequest,
    PermissionUpdateRequest,
)


router = APIRouter(
    prefix="/permissions",
    tags=["permissions"],
    dependencies=[Depends(get_current_user)],
)


db_dependency = Annotated[Session, Depends(get_db)]


@router.post(
    "/", response_model=PermissionReadRequest, status_code=status.HTTP_201_CREATED
)
async def create_permission(
    db: db_dependency, permission_request: PermissionCreateRequest
):

    try:
        with db.begin():  # Automatically commits or rolls back on exit
            permission_model = Permission(
                name=permission_request.name,
                description=permission_request.description,
            )

            db.add(
                permission_model
            )  # create a new instance of a model that is not yet added to the session

        # Must be outside "with" block to ensure to commit the transaction first
        db.refresh(permission_model)  # Refresh the new instance

        return permission_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new permission.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new permission.",
        )


@router.get(
    "/", response_model=List[PermissionReadRequest], status_code=status.HTTP_200_OK
)
async def read_all_permissions(db: db_dependency):
    # if permission is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        stmt = select(Permission).options(
            selectinload(Permission.roles)
        )  # .options(selectinload(permission.permissions)) helps to load efficiently for many-to-many data, here it also returns permissions of permissions
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all permissions.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all permissions.",
        )


@router.get(
    "/{permission_id}",
    response_model=PermissionReadRequest,
    status_code=status.HTTP_200_OK,
)
async def read_permission(db: db_dependency, permission_id: int = Path(gt=0)):
    # if permission is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        stmt = select(Permission).where(Permission.permission_id == permission_id)
        permission_model = db.execute(stmt).scalars().first()

        if permission_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"permission with id {permission_id} not found.",
            )

        return permission_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the permission with id {permission_id}.",
        )
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail,
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the permission with id {permission_id}.",
        )


@router.put(
    "/{permission_id}",
    response_model=PermissionReadRequest,
    status_code=status.HTTP_200_OK,
)
async def update_permission(
    db: db_dependency,
    permission_request: PermissionUpdateRequest,
    permission_id: int = Path(gt=0),
):
    # if permission is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(Permission).where(Permission.permission_id == permission_id)
            permission_model = db.execute(stmt).scalars().first()

            if permission_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"permission with id {permission_id} not found.",
                )

            # Loop through provided fields and update the corresponding fields in permission_model
            update_data = permission_request.model_dump(
                exclude_unset=True
            )  # Only get the provided fields

            for key, value in update_data.items():
                setattr(permission_model, key, value)  # Dynamically update the fields

        return permission_model  # Return the updated permission model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the permission with id {permission_id}.",
        )
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail,
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the permission with id {permission_id}.",
        )


@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_permission(db: db_dependency, permission_id: int = Path(gt=0)):
    # if permission is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(Permission).where(Permission.permission_id == permission_id)
            permission_model = db.execute(stmt).scalars().first()
            if permission_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"permission with id {permission_id} not found.",
                )

            stmt = delete(Permission).where(Permission.permission_id == permission_id)
            db.execute(stmt)
            db.commit()

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the permission with id {permission_id}.",
        )
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail,
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the permission with id {permission_id}.",
        )
