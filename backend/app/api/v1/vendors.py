import logging
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import check_permissions, get_current_user
from app.db.base import get_db
from app.schemas.vendor import (
    VendorCreateRequest,
    VendorReadRequest,
    VendorUpdateRequest,
)
from app.db.models.vendor import Vendor


db_dependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/vendors", tags=["Vendors"])


@router.post(
    "/",
    response_model=VendorReadRequest,
    status_code=status.HTTP_201_CREATED,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def create_vendor(db: db_dependency, vendor_request: VendorCreateRequest):
    """
    Create a new vendor in the database.
    Args:

        vendor_request (VendorCreateRequest): The request object containing the details of the vendor to create.
        - name (str): The name of the vendor.
        - description (str): The description of the vendor.
    Returns:

        Vendor: The newly created vendor model instance.
    Raises:

        HTTPException: If an integrity error or any other database error occurs, or if an unexpected error occurs.
    """

    try:
        vendor_model = Vendor(
            name=vendor_request.name,
            description=vendor_request.description,
        )

        db.add(
            vendor_model
        )  # create a new instance of a model that is not yet added to the session

        db.commit()
        db.refresh(vendor_model)  # Refresh the new instance

        return vendor_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new vendor.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new vendor.",
        )


@router.get(
    "/",
    # dependencies=[Depends(check_permissions("super user permission"))],
    response_model=list[VendorReadRequest],
    status_code=status.HTTP_200_OK,
)
def read_all_vendors(db: db_dependency):
    """
    Fetch all vendors from the database along with their associated permissions.

    Args:

        None
    Returns:

        list[Vendor]: A list of Vendor objects with their associated permissions.
    Raises:

        HTTPException: If an integrity error or any other database error occurs,
                       an HTTPException is raised with an appropriate status code
                       and error message.
    """

    try:
        stmt = select(Vendor)
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all vendors.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all vendors.",
        )


@router.get(
    "/{vendor_id}",
    response_model=VendorReadRequest,
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def read_vendor(db: db_dependency, vendor_id: int = Path(gt=0)):
    """
    Fetch a vendor by its ID from the database.
    Args:

        vendor_id (int): The ID of the vendor to fetch. Must be greater than 0.
    Returns:

        Vendor: The vendor object if found.
    Raises:

        HTTPException: If the vendor is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    """

    try:
        stmt = select(Vendor).where(Vendor.vendor_id == vendor_id)
        vendor_model = db.execute(stmt).scalars().first()

        if vendor_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"vendor with id {vendor_id} not found.",
            )

        return vendor_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the vendor with id {vendor_id}.",
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
            detail=f"An error occurred while fetching the vendor with id {vendor_id}.",
        )


@router.put(
    "/{vendor_id}",
    response_model=VendorReadRequest,
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def update_vendor(
    db: db_dependency,
    vendor_request: VendorUpdateRequest,
    vendor_id: int = Path(gt=0),
):
    """
    Update an existing vendor in the database.
    Args:

        vendor_request (VendorUpdateRequest): The request object containing the fields to update.
        - name (str): The name of the vendor.
        - description (str): The description of the vendor.
        vendor_id (int): The ID of the vendor to update. Must be greater than 0.
    Returns:

        vendor_model: The updated vendor model.
    Raises:

        HTTPException: If the vendor is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    """

    try:
        stmt = select(Vendor).where(Vendor.vendor_id == vendor_id)
        vendor_model = db.execute(stmt).scalars().first()

        if vendor_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"vendor with id {vendor_id} not found.",
            )

        # Loop through provided fields and update the corresponding fields in vendor_model
        update_data = vendor_request.model_dump(
            exclude_unset=True
        )  # Only get the provided fields

        for key, value in update_data.items():
            setattr(vendor_model, key, value)  # Dynamically update the fields

        db.commit()
        db.refresh(vendor_model)  # Refresh the updated instance
        return vendor_model  # Return the updated vendor model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the vendor with id {vendor_id}.",
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
            detail=f"An error occurred while updating the vendor with id {vendor_id}.",
        )


@router.delete(
    "/{vendor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def delete_vendor(db: db_dependency, vendor_id: int = Path(gt=0)):
    """
    Delete a vendor from the database by its ID.
    Args:

        vendor_id (int): The ID of the vendor to delete. Must be greater than 0.
    Raises:

        HTTPException: If the vendor is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    Returns:

        None
    """

    try:
        stmt = select(Vendor).where(Vendor.vendor_id == vendor_id)
        vendor_model = db.execute(stmt).scalars().first()
        if vendor_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"vendor with id {vendor_id} not found.",
            )

        stmt = delete(Vendor).where(Vendor.vendor_id == vendor_id)
        db.execute(stmt)
        db.commit()

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the vendor with id {vendor_id}.",
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
            detail=f"An error occurred while deleting the vendor with id {vendor_id}.",
        )
