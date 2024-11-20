import logging
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import check_permissions, get_current_user
from app.db.base import get_db
from app.schemas.inventory_adjustment_log import (
    InventoryAdjustmentLogReadRequest,
)
from app.db.models.inventory_adjustment_log import InventoryAdjustmentLog


db_dependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/logs", tags=["Logs"])


@router.get(
    "/inventory-adjustment-logs",
    # dependencies=[Depends(check_permissions("super user permission"))],
    response_model=list[InventoryAdjustmentLogReadRequest],
    status_code=status.HTTP_200_OK,
)
def read_all_inventory_adjustment_logs(db: db_dependency):
    """
    Fetch all inventory adjustment logs from the database along with their associated permissions.

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
        stmt = select(InventoryAdjustmentLog)
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all inventory adjustment logs.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all inventory adjustment logs.",
        )


@router.get(
    "/{log_id}",
    response_model=InventoryAdjustmentLogReadRequest,
    status_code=status.HTTP_200_OK,
    # dependencies=[Depends(check_permissions("super user permission"))],
)
def read_inventory_adjustment_log(db: db_dependency, log_id: int = Path(gt=0)):
    """
    Fetch a inventory adjustment log by its ID from the database.
    Args:

        log_id (int): The ID of the inventory adjustment log to fetch. Must be greater than 0.
    Returns:

        Department: The inventory adjustment log object if found.
    Raises:

        HTTPException: If the inventory adjustment log is not found, or if there is an integrity error,
                       database error, or any other unexpected error.
    """

    try:
        stmt = select(InventoryAdjustmentLog).where(
            InventoryAdjustmentLog.log_id == log_id
        )
        log_model = db.execute(stmt).scalars().first()

        if log_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"inventory adjustment log with id {log_id} not found.",
            )

        return log_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the inventory adjustment log with id {log_id}.",
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
            detail=f"An error occurred while fetching the inventory adjustment log with id {log_id}.",
        )
