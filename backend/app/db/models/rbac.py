from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base import Base

# All models relate to RBAC

class User(Base):
    __tablename__ = 'User'

    user_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_name = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    enabled = Column(Boolean, default=True)

    # Created at timestamp
    created_at = Column(DateTime, server_default=func.now())
    
    # Updated at timestamp
    updated_at = Column(DateTime, onupdate=func.now())

    # Define the relationship with back_populates
    roles = relationship('Role', secondary='UserRole', back_populates='users')

class Role(Base):
    __tablename__ = 'Role'

    role_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=False)

    # Created at timestamp
    created_at = Column(DateTime, server_default=func.now())
    
    # Updated at timestamp
    updated_at = Column(DateTime, onupdate=func.now())

    # Define the relationship with back_populates
    users = relationship('User', secondary='UserRole', back_populates='roles')
    permissions = relationship('Permission', secondary='RolePermission', back_populates='roles')

class Permission(Base):
    __tablename__ = 'Permission'

    permission_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=False)

    # Created at timestamp
    created_at = Column(DateTime, server_default=func.now())
    
    # Updated at timestamp
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Define the relationship with back_populates
    roles = relationship('Role', secondary='RolePermission', back_populates='permissions')

UserRole = Table(
    'UserRole',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('User.user_id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('Role.role_id'), primary_key=True)
)

RolePermission = Table(
    'RolePermission',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('Role.role_id'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('Permission.permission_id'), primary_key=True)
)
