import re
from typing import Dict, List


class PronunciationService:
    """
    Performs rule-based pronunciation analysis using
    Whisper word confidence scores.

    This service is deterministic.
    LLM is only used later to generate feedback.
    """

    HIGH_THRESHOLD = 0.50
    MEDIUM_THRESHOLD = 0.75
    LOW_THRESHOLD = 0.85

    STOP_WORDS = {
        "a", "an", "the",
        "and", "or", "but",
        "to", "of", "in", "on", "at",
        "for", "with", "by", "from",
        "is", "are", "was", "were",
        "be", "been", "being",
        "am",
        "i", "me", "my", "mine",
        "we", "our", "ours",
        "you", "your", "yours",
        "he", "his",
        "she", "her",
        "it", "its",
        "they", "them", "their",
        "this", "that",
        "these", "those",
        "as", "if", "so", "than",
        "then", "very",
        "well", "oh", "um", "uh",
        "hmm", "ah"
    }

    def clean_word(self, word: str) -> str:
        word = word.lower()
        word = re.sub(r"[^\w]", "", word)
        return word

    def is_meaningful_word(self, word: str) -> bool:
        cleaned = self.clean_word(word)

        if not cleaned:
            return False

        if cleaned in self.STOP_WORDS:
            return False

        if len(cleaned) <= 2:
            return False

        return True

    def get_severity(self, confidence: float):

        if confidence < self.HIGH_THRESHOLD:
            return "high"

        elif confidence < self.MEDIUM_THRESHOLD:
            return "medium"

        elif confidence < self.LOW_THRESHOLD:
            return "low"

        return None

    def calculate_score(
        self,
        average_confidence: float,
        high_count: int,
        medium_count: int,
    ):

        score = average_confidence * 100

        score -= high_count * 2
        score -= medium_count * 1

        score = max(0, min(round(score), 100))

        return score

    def analyze(self, words: List[Dict]):

        meaningful_words = [
            word
            for word in words
            if self.is_meaningful_word(word["word"])
        ]

        if not meaningful_words:
            return {
                "overall_score": 0,
                "average_confidence": 0,
                "total_words": 0,
                "mistakes": []
            }

        total_confidence = 0

        mistakes = []

        high_count = 0
        medium_count = 0

        for word in meaningful_words:

            confidence = word["probability"]

            total_confidence += confidence

            severity = self.get_severity(confidence)

            if severity == "high":
                high_count += 1

            elif severity == "medium":
                medium_count += 1

            # Ignore low severity words in UI
            if severity in ["high", "medium"]:

                mistakes.append(
                    {
                        "word": word["word"],
                        "confidence": round(confidence, 2),
                        "severity": severity,
                        "start": word["start"],
                        "end": word["end"]
                    }
                )

        average_confidence = (
            total_confidence / len(meaningful_words)
        )

        score = self.calculate_score(
            average_confidence,
            high_count,
            medium_count,
        )

        mistakes.sort(
            key=lambda x: x["confidence"]
        )

        # Cap at top 5 worst words to keep UI focused and ensure
        # every word gets custom LLM feedback (not generic fallback)
        mistakes = mistakes[:5]

        return {
            "overall_score": score,
            "average_confidence": round(
                average_confidence,
                3,
            ),
            "total_words": len(meaningful_words),
            "mistakes": mistakes,
        }


pronunciation_service = PronunciationService()