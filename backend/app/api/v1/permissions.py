import logging
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import check_permissions, get_current_user
from app.db.models.rbac import Permission
from app.db.base import get_db
from app.schemas.permission import (
    PermissionCreateRequest,
    PermissionReadRequest,
    PermissionUpdateRequest,
)


router = APIRouter(prefix="/permissions", tags=["Permissions"])


db_dependency = Annotated[Session, Depends(get_db)]


@router.post(
    "/",
    response_model=PermissionReadRequest,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def create_permission(db: db_dependency, permission_request: PermissionCreateRequest):
    """
    Create a new permission in the database.

    Args:

        permission_request (PermissionCreateRequest): The request body containing the details of the permission to create.
        - name (str): The name of the permission.
        - description (str): The description of the permission.
    Returns:

        Permission: The newly created permission model.

    Raises:

        HTTPException: If an integrity error or any other database error occurs.
    """
    try:
        permission_model = Permission(
            name=permission_request.name,
            description=permission_request.description,
        )

        db.add(
            permission_model
        )  # create a new instance of a model that is not yet added to the session

        db.commit()
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
    "/",
    response_model=list[PermissionReadRequest],
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def read_all_permissions(db: db_dependency):
    """
    Fetches all permissions from the database.
    Args:

        None
    Returns:

        list[Permission]: A list of Permission objects retrieved from the database.
    Raises:

        HTTPException: If an integrity error or any other database error occurs,
                       or if an unexpected error occurs during the operation.
    """

    try:
        stmt = select(Permission).options(selectinload(Permission.roles))
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
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def read_permission(db: db_dependency, permission_id: int = Path(gt=0)):
    """
    Fetch a permission record by its ID.
    Args:

        permission_id (int): The ID of the permission to fetch. Must be greater than 0.
    Returns:

        Permission: The permission model if found.
    Raises:

        HTTPException: If the permission is not found (404), if there is an integrity error (400),
                       or if there is a general database error (500) or if an unexpected error occurs during the operation (500).
    """

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
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def update_permission(
    db: db_dependency,
    permission_request: PermissionUpdateRequest,
    permission_id: int = Path(gt=0),
):
    """
    Update an existing permission in the database.
    Args:

        permission_request (PermissionUpdateRequest): The request object containing the fields to update.
        - name (str): The name of the permission.
        - description (str): The description of the permission.
        permission_id (int): The ID of the permission to update. Must be greater than 0.
    Returns:

        Permission: The updated permission model.
    Raises:

        HTTPException: If the permission with the given ID is not found, or if there is an integrity error or other database error.
    """
    try:
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
        db.commit()
        db.refresh(permission_model)  # Refresh the updated instance
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


@router.delete(
    "/{permission_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def delete_permission(db: db_dependency, permission_id: int = Path(gt=0)):
    """
    Delete a permission from the database.
    Args:

        permission_id (int): The ID of the permission to delete. Must be greater than 0.
    Raises:

        HTTPException: If the permission with the given ID is not found, or if there is an integrity error or other database error.
    Returns:

        None
    """

    try:
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
