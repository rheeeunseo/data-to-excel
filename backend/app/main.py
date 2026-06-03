from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import export_jobs

app = FastAPI(title="PlayStory Excel Export API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    export_jobs.router,
    prefix="/api/export-jobs",
    tags=["export-jobs"],
)


@app.get("/")
def root():
    return {"message": "PlayStory Excel Export API"}


@app.get("/health")
def health():
    return {"ok": True}