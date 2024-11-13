import logging
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette import status
from app.core.config import settings
from app.core.security import get_current_user
from app.db.models.rbac import Role, User
from app.db.base import get_db
from app.schemas.user import UserCreateRequest, UserReadRequest, UserUpdateRequest


db_dependency = Annotated[Session, Depends(get_db)]

router = APIRouter(
    prefix="/users", tags=["users"]
)  # , dependencies=[Depends(get_current_user)]


@router.post("/", response_model=UserReadRequest, status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user_request: UserCreateRequest):

    try:
        with db.begin():  # Automatically commits or rolls back on exit
            user_model = User(
                user_name=user_request.user_name,
                hashed_password=settings.bcrypt_context.hash(user_request.password),
            )

            db.add(
                user_model
            )  # create a new instance of a model that is not yet added to the session

        # Must be outside "with" block to ensure to commit the transaction first
        db.refresh(user_model)  # Refresh the new instance

        return user_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new user.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the new user.",
        )


@router.get("/", response_model=List[UserReadRequest], status_code=status.HTTP_200_OK)
async def read_all_users(db: db_dependency):
    # if user is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        stmt = select(User).options(
            selectinload(User.roles)
        )  # .options(selectinload(User.roles)) helps to load efficiently for many-to-many data, here it also returns roles of users
        result = db.execute(stmt).scalars().all()

        return result

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all users.",
        )
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all users.",
        )


@router.get(
    "/{user_id}", response_model=UserReadRequest, status_code=status.HTTP_200_OK
)
async def read_user(db: db_dependency, user_id: int = Path(gt=0)):
    # if user is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        stmt = select(User).where(User.user_id == user_id)
        user_model = db.execute(stmt).scalars().first()

        if user_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found.",
            )

        return user_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the user with id {user_id}.",
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
            detail=f"An error occurred while fetching the user with id {user_id}.",
        )


@router.put(
    "/{user_id}", response_model=UserReadRequest, status_code=status.HTTP_200_OK
)
async def update_user(
    db: db_dependency, user_request: UserUpdateRequest, user_id: int = Path(gt=0)
):
    # if user is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(User).where(User.user_id == user_id)
            user_model = db.execute(stmt).scalars().first()

            if user_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found.",
                )

            # Loop through provided fields and update the corresponding fields in user_model
            update_data = user_request.model_dump(
                exclude_unset=True
            )  # Only get the provided fields

            for key, value in update_data.items():
                setattr(user_model, key, value)  # Dynamically update the fields

        return user_model  # Return the updated user model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the user with id {user_id}.",
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
            detail=f"An error occurred while updating the user with id {user_id}.",
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db: db_dependency, user_id: int = Path(gt=0)):
    # if user is None:
    #     raise HTTPException(status_code=401, detail='Authentication Failed')
    try:
        with db.begin():  # Automatically commits or rolls back on exit
            stmt = select(User).where(User.user_id == user_id)
            user_model = db.execute(stmt).scalars().first()
            if user_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found.",
                )

            stmt = delete(User).where(User.user_id == user_id)
            db.execute(stmt)
            db.commit()

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the user with id {user_id}.",
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
            detail=f"An error occurred while deleting the user with id {user_id}.",
        )


# Create a new APIRouter instance for User-Role Router: Manages the relationships between users and roles, enabling you to assign or remove roles from users.
user_role = APIRouter(
    prefix="/users/{user_id}/roles",
    tags=["users"],
    dependencies=[Depends(get_current_user)],
)


@user_role.post(
    "/", response_model=UserReadRequest, status_code=status.HTTP_201_CREATED
)
async def assign_roles(
    roles_request: list[
        int
    ],  # Expect to receive a list of role ids not yet assigned to this role
    db: db_dependency,
    user_id: int = Path(gt=0),
):
    try:
        with db.begin():
            stmt = select(User).where(User.user_id == user_id)
            role_model = db.execute(stmt).scalars().first()

            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"user with id {user_id} not found.",
                )

            # Verify if any role to be added is not existing in the Role table
            stmt = select(Role).where(Role.role_id.in_(roles_request))
            existing_roles = db.execute(stmt).scalars().all()
            if len(existing_roles) != len(roles_request):
                # Initialize a new list of type integer to store non-matching role IDs
                not_existing_role_ids: list[int] = []

                # Loop through each role ID in roles_request
                for role_id in roles_request:
                    # Check if the role ID is not in the list of existing role IDs
                    if not any(role_id == role.role_id for role in existing_roles):
                        # Add to the new list if it doesn't exist in existing_roles
                        not_existing_role_ids.append(role_id)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"One or more roles not found: {not_existing_role_ids}",
                )

            # Assign the role to the role
            for perm in existing_roles:
                if perm not in role_model.roles:
                    # this auto maps the models then add records to UserRole table
                    role_model.roles.append(perm)

        db.refresh(role_model)  # Refresh the new instance
        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while assigning roles to the user with id {user_id}.",
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
            detail=f"An error occurred while assigning roles to the user with id {user_id}.",
        )


@user_role.delete("/", response_model=UserReadRequest, status_code=status.HTTP_200_OK)
async def revoke_roles(
    roles_request: list[
        int
    ],  # Expect to receive a list of role ids not yet assigned to this role
    db: db_dependency,
    user_id: int = Path(gt=0),
):
    try:
        with db.begin():
            stmt = select(Role).where(Role.user_id == user_id)
            role_model = db.execute(stmt).scalars().first()

            if role_model is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"user with id {user_id} not found.",
                )

            # Verify if any role to be removed is not existing in the Permission table
            stmt = select(Role).where(Role.role_id.in_(roles_request))
            existing_roles = db.execute(stmt).scalars().all()
            if len(existing_roles) != len(roles_request):
                # Initialize a new list of type integer to store non-matching role IDs
                not_existing_role_ids: list[int] = []

                # Loop through each role ID in roles_request
                for role_id in roles_request:
                    # Check if the role ID is not in the list of existing role IDs
                    if not any(role_id == role.role_id for role in existing_roles):
                        # Add to the new list if it doesn't exist in existing_roles
                        not_existing_role_ids.append(role_id)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"One or more roles not found: {not_existing_role_ids}",
                )

            # Revoke the role to the role
            for role in existing_roles:
                if role in role_model.roles:
                    # this auto maps the models then add records to RolePermission table
                    role_model.roles.remove(role)

        db.refresh(role_model)  # Refresh the new instance
        return role_model

    except IntegrityError as e:
        logging.error(f"Integrity error occurred: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e.orig))
    except SQLAlchemyError as e:
        logging.error(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while revoking roles from the user with id {user_id}.",
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
            detail=f"An error occurred while revoking roles from the user with id {user_id}.",
        )
