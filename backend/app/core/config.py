from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", OPENROUTER_API_KEY)

    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")

    MAX_AUDIO_DURATION = int(os.getenv("MAX_AUDIO_DURATION", 45))
    MIN_AUDIO_DURATION = int(os.getenv("MIN_AUDIO_DURATION", 30))

    TEMP_FOLDER = os.getenv("TEMP_FOLDER", "temp")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

    # CORS Origins - Comma separated list of origins. Fallback to common dev/production origins.
    ALLOWED_CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]


settings = Settings()