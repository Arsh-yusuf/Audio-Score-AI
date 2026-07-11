from pydantic import BaseModel


class Mistake(BaseModel):
    word: str
    confidence: float
    severity: str
    start: float
    end: float
    reason: str | None = None


class PronunciationResponse(BaseModel):

    overall_score: int

    average_confidence: float

    total_words: int

    transcript: str

    mistakes: list[Mistake]

    feedback: list[str]