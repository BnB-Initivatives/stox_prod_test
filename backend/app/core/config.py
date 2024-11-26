import os
from typing import Any
from pydantic import (
    PostgresDsn,
    computed_field,
    field_validator,
    model_validator,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer


class Settings(BaseSettings):
    # Configuration for JWT - This should be unique and random - For production and security, this should be stored securely in hard-coded in code base.
    SECRET_KEY: str = (
        "eff6d0c182f4d53a901d5189c84dacf969d4d85edd288a9acd6418022c1d225b"  # Need to be unique - Can generate random with `openssl rand -hex 32`
    )
    ALGORITHM: str = "HS256"

    # Configuration for access token
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ACCESS_TOKEN_EXPIRE_DAYS_WITH_REMEMBER_ME: int = 7
    ACCESS_TOKEN_TYPE: str = "bearer"

    # Configuration for password hashing
    BCRYPT_SCHEMES: list[str] = ["bcrypt"]
    DEPRECATED: str = "auto"

    # You can create the instances outside the class
    @property
    def bcrypt_context(self) -> CryptContext:
        return CryptContext(schemes=self.BCRYPT_SCHEMES, deprecated=self.DEPRECATED)

    @property
    def oauth2_bearer(self) -> OAuth2PasswordBearer:
        return OAuth2PasswordBearer(tokenUrl="auth/token")

    ## SETTINGS FOR DATABASE
    # POSTGRES_SERVER: str
    # POSTGRES_PORT: int = 5432
    # POSTGRES_USER: str
    # POSTGRES_PASSWORD: str | None = None
    # POSTGRES_PASSWORD_FILE: str | None = None
    # POSTGRES_DB: str

    # @model_validator(mode="before")
    # @classmethod
    # def check_postgres_password(cls, data: Any) -> Any:
    #     if isinstance(data, dict):
    #         if (
    #             data.get("POSTGRES_PASSWORD_FILE") is None
    #             and data.get("POSTGRES_PASSWORD") is None
    #         ):
    #             raise ValueError(
    #                 "At least one of POSTGRES_PASSWORD_FILE and POSTGRES_PASSWORD must be set."
    #             )
    #     return data

    # @field_validator("POSTGRES_PASSWORD_FILE")
    # def read_password_from_file(cls, v):
    #     if v is not None:
    #         file_path = v
    #         if os.path.exists(file_path):
    #             with open(file_path, "r") as file:
    #                 return file.read().strip()
    #         raise ValueError(f"Password file {file_path} does not exist.")
    #     return v

    # @computed_field
    # @property
    # def SQLALCHEMY_DATABASE_URL(self) -> PostgresDsn:
    #     return MultiHostUrl.build(
    #         scheme="postgresql+psycopg",
    #         username=self.POSTGRES_USER,
    #         password=(
    #             self.POSTGRES_PASSWORD
    #             if self.POSTGRES_PASSWORD
    #             else self.POSTGRES_PASSWORD_FILE
    #         ),
    #         host=self.POSTGRES_SERVER,
    #         port=self.POSTGRES_PORT,
    #         path=self.POSTGRES_DB,
    #     )

    # DB Connection for SQLite for local development
    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        return "sqlite:///./app.db"


settings = Settings()
