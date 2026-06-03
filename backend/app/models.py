from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    product_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    order_date = Column(DateTime(timezone=True), nullable=False)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(20), nullable=False, default="pending")

    requested_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    file_path = Column(String(255), nullable=True)
    error_msg = Column(Text, nullable=True)
    progress = Column(Integer, nullable=False, default=0)