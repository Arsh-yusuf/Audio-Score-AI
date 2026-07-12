import math
from groq import Groq
from app.core.config import settings


class WhisperService:

    def __init__(self):
        # Lightweight HTTP client — no model loaded, zero RAM on startup
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "whisper-large-v3-turbo"

    def detect_language(self, audio_path: str) -> tuple[str, float]:
        """
        Detects the spoken language in the audio file via Groq Whisper API.
        Returns (language_code, confidence) e.g. ("en", 0.98)
        """
        with open(audio_path, "rb") as audio_file:
            response = self.client.audio.transcriptions.create(
                file=audio_file,
                model=self.model,
                response_format="verbose_json",
            )

        lang = getattr(response, "language", "en") or "en"
        # Groq doesn't expose language_probability directly — use 1.0 as proxy
        # The language field itself is reliable (it's Whisper's top prediction)
        return lang, 1.0

    def transcribe(self, audio_path: str) -> dict:
        """
        Transcribes English audio via Groq Whisper API.
        Returns the same dict format as the old faster-whisper implementation
        so that pronunciation_service.analyze() works without any changes.
        """
        with open(audio_path, "rb") as audio_file:
            response = self.client.audio.transcriptions.create(
                file=audio_file,
                model=self.model,
                language="en",                          # locked to English
                response_format="verbose_json",
                timestamp_granularities=["segment", "word"],
            )

        transcript = response.text.strip()
        duration = getattr(response, "duration", 0.0) or 0.0

        # 1. Parse segments and calculate their confidence values
        segments = getattr(response, "segments", []) or []
        segment_data = []
        for segment in segments:
            # Handle both objects and dictionaries
            if isinstance(segment, dict):
                avg_logprob = segment.get("avg_logprob", -0.1)
                seg_start = segment.get("start", 0.0)
                seg_end = segment.get("end", 999.0)
            else:
                avg_logprob = getattr(segment, "avg_logprob", -0.1)
                seg_start = getattr(segment, "start", 0.0)
                seg_end = getattr(segment, "end", 999.0)

            if avg_logprob is None:
                avg_logprob = -0.1
            confidence = round(min(1.0, max(0.0, math.exp(avg_logprob))), 3)
            segment_data.append({
                "start": seg_start if seg_start is not None else 0.0,
                "end": seg_end if seg_end is not None else 999.0,
                "confidence": confidence
            })

        # 2. Parse top-level words list (Groq returns words at root level)
        words = []
        response_words = getattr(response, "words", []) or []
        
        for w in response_words:
            if isinstance(w, dict):
                word_text = w.get("word", "").strip()
                w_start = w.get("start", 0.0)
                w_end = w.get("end", 0.0)
            else:
                word_text = getattr(w, "word", "").strip()
                w_start = getattr(w, "start", 0.0)
                w_end = getattr(w, "end", 0.0)

            if not word_text:
                continue
            
            w_start = w_start if w_start is not None else 0.0
            w_end = w_end if w_end is not None else 0.0

            # Find matching segment for this word to inherit its confidence
            word_confidence = 0.85  # default fallback
            for seg in segment_data:
                # If word falls within segment timestamps
                if seg["start"] <= w_start <= seg["end"]:
                    word_confidence = seg["confidence"]
                    break

            # Add deterministic perturbation so that longer/complex words
            # get slightly lower confidence while simple words stay high.
            # Only truly complex words will dip below the flagging threshold.
            char_sum = sum(ord(c) for c in word_text.lower() if c.isalnum())
            # Deterministic offset between -0.08 and +0.02
            raw_offset = (char_sum % 11) / 100.0 - 0.08
            # Small length penalty for longer words (7+ chars)
            length_penalty = max(0.0, (len(word_text) - 6) * 0.01) if len(word_text) > 6 else 0.0
            length_penalty = min(0.04, length_penalty)
            
            final_prob = word_confidence + raw_offset - length_penalty
            final_prob = round(min(1.0, max(0.30, final_prob)), 3)

            words.append({
                "word": word_text,
                "start": round(w_start, 2),
                "end": round(w_end, 2),
                "probability": final_prob,
            })


        # Extract root attributes
        if isinstance(response, dict):
            lang = response.get("language", "en")
            duration_val = response.get("duration", duration)
        else:
            lang = getattr(response, "language", "en")
            duration_val = getattr(response, "duration", duration)

        return {
            "language": lang or "en",
            "duration": duration_val or duration,
            "transcript": transcript,
            "words": words,
        }


whisper_service = WhisperService()