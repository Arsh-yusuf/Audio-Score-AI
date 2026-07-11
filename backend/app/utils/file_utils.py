import os
import uuid
import aiofiles

from fastapi import UploadFile

from app.core.config import settings


async def save_upload_file(file: UploadFile) -> str:
    """
    Save uploaded audio to the temporary directory.
    Returns the full file path.
    """

    os.makedirs(settings.TEMP_FOLDER, exist_ok=True)

    extension = os.path.splitext(file.filename)[1]

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(settings.TEMP_FOLDER, filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    return file_path

def delete_file(file_path: str):

    if os.path.exists(file_path):
        os.remove(file_path)