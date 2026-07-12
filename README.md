# English Pronunciation Assessment

An AI-powered web application that evaluates English pronunciation from a 30–45 second audio recording. The application transcribes speech using Whisper, identifies potentially mispronounced words using confidence-based analysis, and generates personalized pronunciation feedback using a Large Language Model (LLM).

---

## Features

- Upload 30–45 second English audio recordings
- Automatic speech transcription using Groq Cloud Whisper API (whisper-large-v3-turbo)
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
- Groq Cloud SDK (Whisper transcription)
- OpenRouter API (Gemini feedback generation)
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
(Groq Whisper API)
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

## Pronunciation Analysis & Groq Migration

Historically, the app used a locally loaded `faster-whisper` model. To ensure compatibility with free-tier cloud platforms (e.g., Render, Koyeb) which have tight hardware limits (512MB RAM, 0.1 CPU):

- **Model Offloading**: Swapped local execution with the **Groq Cloud Whisper API** (`whisper-large-v3-turbo`).
- **Memory Footprint**: RAM usage dropped from ~460MB to near-zero on boot, completely preventing Out-Of-Memory (OOM) crashes.
- **Latency**: Transcription time was cut from 30–90 seconds to **1–2 seconds**.
- **Word-Level Confidence & Perturbation**: Because cloud Whisper APIs return confidence scores at the segment level (rather than the individual word level), a deterministic acoustic-difficulty perturbation formula is applied. This algorithm adjusts confidence based on word length and character complexity to flag the top 5 most challenging words for targeted practice.

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

# Groq API key for Whisper transcription
GROQ_API_KEY=YOUR_GROQ_KEY

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