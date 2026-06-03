from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Job
from app.schemas import ExportJobResponse
from app.tasks.excel import generate_excel_task

router = APIRouter()


@router.post("", response_model=ExportJobResponse, status_code=202)
def create_export_job(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    job = Job(status="pending")
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(generate_excel_task, job.id)

    return job


@router.get("", response_model=list[ExportJobResponse])
def get_export_jobs(db: Session = Depends(get_db)):
    return db.query(Job).order_by(Job.id.desc()).all()


@router.get("/{job_id}", response_model=ExportJobResponse)
def get_export_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}/download")
def download_export_file(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != "done":
        raise HTTPException(status_code=400, detail="File is not ready")
    if not job.file_path or not Path(job.file_path).exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=job.file_path,
        filename=f"orders_{job.id}.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
