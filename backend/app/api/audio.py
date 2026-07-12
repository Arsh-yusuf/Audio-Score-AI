from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.whisper_service import whisper_service
from app.services.pronunciation_service import pronunciation_service
from app.services.llm_service import llm_service
import pycountry

from app.utils.audio_utils import (
    validate_audio_type,
    get_audio_duration,
    validate_audio_duration,
)

from app.utils.file_utils import (
    save_upload_file,
    delete_file,
)

router = APIRouter(
    prefix="/api",
    tags=["Audio"]
)


@router.post("/analyze")
async def analyze_audio(
    file: UploadFile = File(...)
):

    validate_audio_type(file.content_type, file.filename)

    file_path = await save_upload_file(file)

    try:

        duration = get_audio_duration(file_path)

        validate_audio_duration(duration)

        # ── Language gate ──────────────────────────────────────────
        # Detect language first without locking to English.
        # Reject non-English audio with a clear error before doing
        # the expensive full transcription pass.
        detected_lang, lang_confidence = whisper_service.detect_language(file_path)

        if detected_lang != "en":
            # Try to get a human-readable language name for the error message
            lang_obj = pycountry.languages.get(alpha_2=detected_lang)
            lang_name = lang_obj.name if lang_obj else detected_lang.upper()
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Only English audio is supported. "
                    f"Detected language: {lang_name} "
                    f"(confidence: {lang_confidence:.0%}). "
                    f"Please upload an English recording."
                )
            )
        # ───────────────────────────────────────────────────────────

        result = whisper_service.transcribe(file_path)
        analysis = pronunciation_service.analyze(result["words"])
        

        llm_result = llm_service.generate_feedback(
            overall_score=analysis["overall_score"],
            words=[
                mistake["word"] 
                for mistake in analysis["mistakes"][:5]
            ],
        )

        enhanced_mistakes = []

        for mistake in analysis["mistakes"]:

            llm = llm_result.get(mistake["word"], {})

            enhanced_mistakes.append(
                {
                    **mistake,
                    "reason": llm.get("reason","Low pronunication confidence"),
                    "tip": llm.get("tip","Practice this word slowly"),
                }
            )

        return {
            "success": True,
            "duration": round(duration, 2),
            "language": result["language"],
            "overall_score": analysis["overall_score"],
            "average_confidence": analysis["average_confidence"],
            "transcript": result["transcript"],
            "mistakes": enhanced_mistakes,
            "feedback": llm_result.get("feedback", [])
        }

    finally:
        delete_file(file_path)