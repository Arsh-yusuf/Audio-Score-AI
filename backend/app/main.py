from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.audio import router as audio_router

from app.core.config import settings

app = FastAPI(
    title="Pronunciation Assessment API",
    version="1.0.0",
    description="Backend API for English Pronunciation Assessment"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(audio_router)

@app.get("/")
async def root():
    return {
        "message": "Pronunciation Assessment API is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }