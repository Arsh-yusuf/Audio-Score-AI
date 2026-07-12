ALLOWED_AUDIO_TYPES = [
    # MP3 / MPEG variants — browsers are inconsistent here
    "audio/mpeg",
    "audio/mp3",
    "audio/mpeg3",
    "audio/x-mpeg",
    "audio/x-mpeg-3",
    "audio/x-mp3",
    # Windows registers .mpeg as video/mpeg even for audio-only files
    "video/mpeg",
    # WAV
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    # M4A / MP4 audio
    "audio/mp4",
    "audio/x-m4a",
    "audio/aac",
    # WebM / OGG
    "audio/webm",
    "audio/ogg",
    # Generic fallback some browsers send
    "application/octet-stream",
]

# Extension-based fallback — used when the browser sends a generic/wrong MIME type
ALLOWED_EXTENSIONS = {
    ".mp3", ".mpeg", ".mpg",
    ".wav",
    ".m4a", ".mp4",
    ".webm",
    ".ogg", ".oga",
    ".aac",
    ".flac",
}