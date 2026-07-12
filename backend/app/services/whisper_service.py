from faster_whisper import WhisperModel

from app.core.config import settings


class WhisperService:

    def __init__(self):

        self.model = WhisperModel(
            settings.WHISPER_MODEL,
            device="cpu",
            compute_type="int8"
        )

    def detect_language(self, audio_path: str) -> tuple[str, float]:
        """
        Runs a fast language-detection pass on the first 30 s of audio
        without locking to any language.
        Returns (language_code, confidence) e.g. ("en", 0.98)
        """
        _, info = self.model.transcribe(
            audio_path,
            beam_size=1,          # fastest possible pass
            without_timestamps=True,
        )
        return info.language, info.language_probability

    def transcribe(self, audio_path: str):

        segments, info = self.model.transcribe(
            audio_path,
            beam_size=5,
            language="en",        # locked to English after detection confirms it
            word_timestamps=True
        )

        transcript = ""

        words = []

        for segment in segments:

            transcript += segment.text + " "

            if segment.words:

                for word in segment.words:

                    words.append({
                        "word": word.word.strip(),
                        "start": round(word.start, 2),
                        "end": round(word.end, 2),
                        "probability": round(word.probability, 3)
                    })

        return {
            "language": info.language,
            "duration": info.duration,
            "transcript": transcript.strip(),
            "words": words
        }


whisper_service = WhisperService()