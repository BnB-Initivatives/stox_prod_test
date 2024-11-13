import logging
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.security import check_permissions, get_current_user
from app.db.models.rbac import Permission, Role
from app.db.base import get_db
from app.schemas.role import RoleCreateRequest, RoleReadRequest, RoleUpdateRequest


router = APIRouter(
    prefix="/roles", tags=["roles"], dependencies=[Depends(get_current_user)]
)


db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/", response_model=RoleReadRequest, status_code=status.HTTP_201_CREATED)
async def create_role(db: db_dependency, role_request: RoleCreateRequest):

    try:
        with db.begin():  # Automatically commits or rolls back on exit
            role_model = Role(
                name=role_request.name,
                description=role_request.description,
            )

            db.add(
                role_model
            )  # create a new instance of a model that is not yet added to the session

        # Must be outside "with" block to ensure to commit the transaction first
        db.refresh(role_model)  # Refresh the new instance

        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new role.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new role.",
        )


@router.get(
    "/",
    dependencies=[Depends(check_permissions("permission 1"))],
    response_model=List[RoleReadRequest],
    status_code=status.HTTP_200_OK,
)
async def read_all_roles(db: db_dependency):

    try:
        stmt = select(Role).options(
            selectinload(Role.permissions)
        )  # .options(selectinload(role.roles)) helps to load efficiently for many-to-many data, here it also returns roles of roles
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all roles.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all roles.",
        )


@router.get(
    "/{role_id}", response_model=RoleReadRequest, status_code=status.HTTP_200_OK
)
async def read_role(db: db_dependency, role_id: int = Path(gt=0)):
    # if role is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        stmt = select(Role).where(Role.role_id == role_id)
        role_model = db.execute(stmt).scalars().first()

        if role_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"role with id {role_id} not found.",
            )

        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the role with id {role_id}.",
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
            detail=f"An error occurred while fetching the role with id {role_id}.",
        )


@router.put(
    "/{role_id}", response_model=RoleReadRequest, status_code=status.HTTP_200_OK
)
async def update_role(
    db: db_dependency, role_request: RoleUpdateRequest, role_id: int = Path(gt=0)
):
    # if role is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(Role).where(Role.role_id == role_id)
            role_model = db.execute(stmt).scalars().first()

            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"role with id {role_id} not found.",
                )

            # Loop through provided fields and update the corresponding fields in role_model
            update_data = role_request.model_dump(
                exclude_unset=True
            )  # Only get the provided fields

            for key, value in update_data.items():
                setattr(role_model, key, value)  # Dynamically update the fields

        return role_model  # Return the updated role model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the role with id {role_id}.",
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
            detail=f"An error occurred while updating the role with id {role_id}.",
        )


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(db: db_dependency, role_id: int = Path(gt=0)):
    # if role is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(Role).where(Role.role_id == role_id)
            role_model = db.execute(stmt).scalars().first()
            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"role with id {role_id} not found.",
                )

            stmt = delete(Role).where(Role.role_id == role_id)
            db.execute(stmt)
            db.commit()

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e.orig)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the role with id {role_id}.",
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
            detail=f"An error occurred while deleting the role with id {role_id}.",
        )


# Create a new APIRouter instance for Role-Permission Router: Specifically manages the relationships between roles and permissions, allowing you to assign and revoke permissions from roles.
role_permission = APIRouter(
    prefix="/roles/{role_id}/permissions",
    tags=["roles"],
    dependencies=[Depends(get_current_user)],
)


@role_permission.post(
    "/", response_model=RoleReadRequest, status_code=status.HTTP_201_CREATED
)
async def assign_permissions(
    permissions_request: list[
        int
    ],  # Expect to receive a list of permission ids not yet assigned to this role
    db: db_dependency,
    role_id: int = Path(gt=0),
):
    try:
        with db.begin():
            stmt = select(Role).where(Role.role_id == role_id)
            role_model = db.execute(stmt).scalars().first()

            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"role with id {role_id} not found.",
                )

            # Verify if any permission to be added is not existing in the Permission table
            stmt = select(Permission).where(
                Permission.permission_id.in_(permissions_request)
            )
            existing_permissions = db.execute(stmt).scalars().all()
            if len(existing_permissions) != len(permissions_request):
                # Initialize a new list of type integer to store non-matching permission IDs
                not_existing_permission_ids: list[int] = []

                # Loop through each permission ID in permissions_request
                for permission_id in permissions_request:
                    # Check if the permission ID is not in the list of existing permission IDs
                    if not any(
                        permission_id == permission.permission_id
                        for permission in existing_permissions
                    ):
                        # Add to the new list if it doesn't exist in existing_permissions
                        not_existing_permission_ids.append(permission_id)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"One or more permissions not found: {not_existing_permission_ids}",
                )

            # Assign the permission to the role
            for perm in existing_permissions:
                if perm not in role_model.permissions:
                    # print(perm.permission_id)
                    # this auto maps the models then add records to RolePermission table
                    role_model.permissions.append(perm)

        db.refresh(role_model)  # Refresh the new instance
        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while assigning permissions to the role with id {role_id}.",
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
            detail=f"An error occurred while assigning permissions to the role with id {role_id}.",
        )


@role_permission.delete(
    "/", response_model=RoleReadRequest, status_code=status.HTTP_200_OK
)
async def revoke_permissions(
    permissions_request: list[
        int
    ],  # Expect to receive a list of permission ids not yet assigned to this role
    db: db_dependency,
    role_id: int = Path(gt=0),
):
    try:
        with db.begin():
            stmt = select(Role).where(Role.role_id == role_id)
            role_model = db.execute(stmt).scalars().first()

            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"role with id {role_id} not found.",
                )

            # Verify if any permission to be removed is not existing in the Permission table
            stmt = select(Permission).where(
                Permission.permission_id.in_(permissions_request)
            )
            existing_permissions = db.execute(stmt).scalars().all()
            if len(existing_permissions) != len(permissions_request):
                # Initialize a new list of type integer to store non-matching permission IDs
                not_existing_permission_ids: list[int] = []

                # Loop through each permission ID in permissions_request
                for permission_id in permissions_request:
                    # Check if the permission ID is not in the list of existing permission IDs
                    if not any(
                        permission_id == permission.permission_id
                        for permission in existing_permissions
                    ):
                        # Add to the new list if it doesn't exist in existing_permissions
                        not_existing_permission_ids.append(permission_id)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"One or more permissions not found: {not_existing_permission_ids}",
                )

            # Revoke the permission to the role
            for perm in existing_permissions:
                if perm in role_model.permissions:
                    # print(perm.permission_id)
                    # this auto maps the models then add records to RolePermission table
                    role_model.permissions.remove(perm)

        db.refresh(role_model)  # Refresh the new instance
        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while revoking permissions from the role with id {role_id}.",
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
            detail=f"An error occurred while revoking permissions from the role with id {role_id}.",
        )
