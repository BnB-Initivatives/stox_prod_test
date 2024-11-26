import logging
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import check_permissions, get_current_user
from app.db.base import get_db
from app.schemas.department import (
    DepartmentCreateRequest,
    DepartmentReadRequest,
    DepartmentUpdateRequest,
)
from app.db.models.department import Department


db_dependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post(
    "/",
    response_model=DepartmentReadRequest,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def create_department(db: db_dependency, department_request: DepartmentCreateRequest):
    """
    Create a new department in the database.
    Args:

        department_request (DepartmentCreateRequest): The request object containing the details of the department to create.
        - name (str): The name of the department.
        - description (str): The description of the department.
    Returns:

        Department: The newly created department model instance.
    Raises:

        HTTPException: If an integrity error or any other database error occurs, or if an unexpected error occurs.
    """

    try:
        department_model = Department(
            name=department_request.name,
            description=department_request.description,
        )

        db.add(
            department_model
        )  # create a new instance of a model that is not yet added to the session

        db.commit()
        db.refresh(department_model)  # Refresh the new instance

        return department_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new department.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new department.",
        )


@router.get(
    "/",
    # dependencies=[Depends(check_permissions("super user permission"))],
    response_model=list[DepartmentReadRequest],
    status_code=status.HTTP_200_OK,
)
def read_all_departments(db: db_dependency):
    """
    Fetch all departments from the database along with their associated permissions.

    Args:

        None
    Returns:

        list[Department]: A list of Department objects with their associated permissions.
    Raises:

        HTTPException: If an integrity error or any other database error occurs,
                       an HTTPException is raised with an appropriate status code
                       and error message.
    """

    try:
        stmt = select(Department)
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all departments.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all departments.",
        )


@router.get(
    "/{department_id}",
    response_model=DepartmentReadRequest,
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def read_department(db: db_dependency, department_id: int = Path(gt=0)):
    """
    Fetch a department by its ID from the database.
    Args:

        department_id (int): The ID of the department to fetch. Must be greater than 0.
    Returns:

        Department: The department object if found.
    Raises:

        HTTPException: If the department is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    """

    try:
        stmt = select(Department).where(Department.department_id == department_id)
        department_model = db.execute(stmt).scalars().first()

        if department_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"department with id {department_id} not found.",
            )

        return department_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the department with id {department_id}.",
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
            detail=f"An error occurred while fetching the department with id {department_id}.",
        )


@router.put(
    "/{department_id}",
    response_model=DepartmentReadRequest,
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def update_department(
    db: db_dependency,
    department_request: DepartmentUpdateRequest,
    department_id: int = Path(gt=0),
):
    """
    Update an existing department in the database.
    Args:

        department_request (DepartmentUpdateRequest): The request object containing the fields to update.
        - name (str): The name of the department.
        - description (str): The description of the department.
        department_id (int): The ID of the department to update. Must be greater than 0.
    Returns:

        department_model: The updated department model.
    Raises:

        HTTPException: If the department is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    """

    try:
        stmt = select(Department).where(Department.department_id == department_id)
        department_model = db.execute(stmt).scalars().first()

        if department_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"department with id {department_id} not found.",
            )

        # Loop through provided fields and update the corresponding fields in department_model
        update_data = department_request.model_dump(
            exclude_unset=True
        )  # Only get the provided fields

        for key, value in update_data.items():
            setattr(department_model, key, value)  # Dynamically update the fields

        db.commit()
        db.refresh(department_model)  # Refresh the updated instance
        return department_model  # Return the updated department model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the department with id {department_id}.",
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
            detail=f"An error occurred while updating the department with id {department_id}.",
        )


@router.delete(
    "/{department_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def delete_department(db: db_dependency, department_id: int = Path(gt=0)):
    """
    Delete a department from the database by its ID.
    Args:

        department_id (int): The ID of the department to delete. Must be greater than 0.
    Raises:

        HTTPException: If the department is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    Returns:

        None
    """

    try:
        stmt = select(Department).where(Department.department_id == department_id)
        department_model = db.execute(stmt).scalars().first()
        if department_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"department with id {department_id} not found.",
            )

        stmt = delete(Department).where(Department.department_id == department_id)
        db.execute(stmt)
        db.commit()

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the department with id {department_id}.",
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
            detail=f"An error occurred while deleting the department with id {department_id}.",
        )
