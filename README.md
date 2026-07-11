# English Pronunciation Assessment

An AI-powered web application that evaluates English pronunciation from a 30–45 second audio recording. The application transcribes speech using Whisper, identifies potentially mispronounced words using confidence-based analysis, and generates personalized pronunciation feedback using a Large Language Model (LLM).

---

## Features

- Upload 30–45 second English audio recordings
- Automatic speech transcription using Faster-Whisper
- Word-level timestamps and confidence extraction
- Pronunciation scoring using rule-based confidence analysis
- Highlights words that may require pronunciation improvement
- AI-generated pronunciation explanations and improvement tips
- Clean, responsive React frontend
- FastAPI backend with REST API

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Faster-Whisper
- OpenRouter API
- FFmpeg
- Python

---

## Project Structure

```
frontend/
    src/
        components/
        services/

backend/
    app/
        api/
        services/
        utils/
        core/
        schemas/
```

---

## AI Pipeline

```
Audio Upload
      │
      ▼
Audio Validation
      │
      ▼
Speech-to-Text
(Faster Whisper)
      │
      ▼
Word Confidence Analysis
      │
      ▼
Pronunciation Score
      │
      ▼
LLM Feedback Generation
      │
      ▼
Frontend Visualization
```

---

## Pronunciation Analysis

The application uses Faster-Whisper to generate:

- Transcript
- Word timestamps
- Word confidence scores

A rule-based scoring module:

- Removes filler and stop words
- Computes an overall pronunciation score
- Identifies words with low recognition confidence
- Categorizes mistakes into High and Medium severity

These flagged words are then sent to the LLM, which generates:

- Word-specific explanations
- Pronunciation tips
- Overall feedback

This separation keeps scoring deterministic while using the LLM only for natural-language coaching.

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENROUTER_API_KEY=YOUR_KEY
OPENROUTER_MODEL=google/gemini-2.5-flash-lite

WHISPER_MODEL=base

MAX_AUDIO_DURATION=45
MIN_AUDIO_DURATION=30
```

Run:

```bash
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoint

### POST

```
/api/analyze
```

Request:

```
multipart/form-data

file : Audio File
```

Response

```json
{
  "overall_score":84,
  "transcript":"...",
  "mistakes":[...],
  "feedback":[...]
}
```

---

## Future Improvements

- Phoneme-level pronunciation analysis
- Speaker-specific adaptation
- Audio playback with highlighted timestamps
- Progress tracking across multiple sessions
- Support for multiple accents
- User authentication and history

---

## Author

Mohd Yusuf