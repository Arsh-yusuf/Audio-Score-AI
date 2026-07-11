from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.audio import router as audio_router

app = FastAPI(
    title="Pronunciation Assessment API",
    version="1.0.0",
    description="Backend API for English Pronunciation Assessment"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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