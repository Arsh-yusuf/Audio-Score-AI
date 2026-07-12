import subprocess

from fastapi import HTTPException

from app.core.constants import ALLOWED_AUDIO_TYPES
from app.core.config import settings


def validate_audio_type(content_type: str, filename: str = ""):
    import os
    from app.core.constants import ALLOWED_EXTENSIONS

    # Primary check: MIME type
    if content_type in ALLOWED_AUDIO_TYPES:
        return

    # Fallback: check file extension (handles browsers that send wrong MIME types,
    # e.g. Windows sends .mpeg files as "video/mpeg" or "application/octet-stream")
    ext = os.path.splitext(filename)[1].lower()
    if ext in ALLOWED_EXTENSIONS:
        return

    raise HTTPException(
        status_code=400,
        detail=f"Unsupported audio format. Got MIME type '{content_type}' "
               f"with extension '{ext}'. "
               f"Supported formats: MP3, MPEG, WAV, M4A, MP4, WebM, OGG, AAC, FLAC."
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