import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Обработчик чата DAV AI — принимает вопрос пользователя и возвращает ответ от Groq."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    question = body.get("question", "").strip()

    if not question:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Вопрос не может быть пустым"}),
        }

    api_key = os.environ.get("GROQ_API_KEY", "")

    payload = json.dumps({
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": (
                    "Ты — DAV AI, умный и дружелюбный AI-ассистент. "
                    "Отвечай чётко, по делу и по-русски. "
                    "Будь полезным и приветливым."
                ),
            },
            {"role": "user", "content": question},
        ],
        "max_tokens": 500,
        "temperature": 0.7,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        answer = result["choices"][0]["message"]["content"]
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"answer": answer}),
        }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"answer": f"[DEBUG] HTTP {e.code}: {error_body}"}),
        }
