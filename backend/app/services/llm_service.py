import json

from openai import OpenAI

from app.core.config import settings


class LLMService:

    def __init__(self):

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )

    def _clean_json(self, text: str):

        text = text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "")

        if text.startswith("```"):
            text = text.replace("```", "")

        if text.endswith("```"):
            text = text[:-3]

        return text.strip()

    def _fallback(self, words):

        result = {}

        for word in words:

            result[word] = {
                "reason": "The pronunciation of this word may have been unclear.",
                "tip": f"Practice saying '{word}' slowly and clearly."
            }

        result["feedback"] = [
            "Speak a little slower.",
            "Focus on clearly pronouncing difficult words.",
            "Practice multi-syllable words regularly."
        ]

        return result

    def generate_feedback(
        self,
        overall_score: int,
        words: list[str],
    ):

        if not words:
            return {
                "feedback": [
                    "Excellent pronunciation.",
                    "Your speech was clear.",
                    "Keep practicing."
                ]
            }

        prompt = f"""
You are an English pronunciation coach.

Overall pronunciation score: {overall_score}/100.

The following English words may have pronunciation issues:

{", ".join(words)}

For EACH word generate:

- reason
- pronunciation tip

Also generate exactly 3 overall feedback points.

IMPORTANT

Return ONLY valid JSON.

Do not use markdown.

Format exactly like this:

{{
  "WORD": {{
      "reason": "...",
      "tip": "..."
  }},
  "WORD2": {{
      "reason": "...",
      "tip": "..."
  }},
  "feedback":[
      "...",
      "...",
      "..."
  ]
}}
"""

        try:

            response = self.client.chat.completions.create(
                model=settings.OPENROUTER_MODEL,
                temperature=0.2,
                max_tokens=700,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an English pronunciation coach."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            content = response.choices[0].message.content

            print("\n========== RAW LLM OUTPUT ==========\n")
            print(content)
            print("\n===================================\n")

            content = self._clean_json(content)

            return json.loads(content)

        except Exception as e:

            print("LLM Error:", e)

            return self._fallback(words)


llm_service = LLMService()