# app/schemas.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ExportJobResponse(BaseModel):
    id: int
    status: str
    requested_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    file_path: Optional[str] = None
    error_msg: Optional[str] = None
    progress: int = 0

    class Config:
        from_attributes = True