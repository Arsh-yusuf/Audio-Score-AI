import subprocess

from fastapi import HTTPException

from app.core.constants import ALLOWED_AUDIO_TYPES
from app.core.config import settings


def validate_audio_type(content_type: str):

    if content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format."
        )


def get_audio_duration(file_path: str) -> float:
    """
    Returns duration in seconds.
    """

    command = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file_path,
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    return float(result.stdout.strip())


def validate_audio_duration(duration: float):

    if duration < settings.MIN_AUDIO_DURATION:
        raise HTTPException(
            status_code=400,
            detail=f"Audio must be at least {settings.MIN_AUDIO_DURATION} seconds."
        )

    if duration > settings.MAX_AUDIO_DURATION:
        raise HTTPException(
            status_code=400,
            detail=f"Audio cannot exceed {settings.MAX_AUDIO_DURATION} seconds."
        )