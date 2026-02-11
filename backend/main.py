"""
AIVA-Train Backend mit DeepSeek R1T Chimera Integration
FastAPI-Backend für die Chat-UI mit DeepSeek R1T Chimera KI (über OpenRouter)

WICHTIG:
- API-Key wird aus Umgebungsvariable OPENROUTER_API_KEY gelesen
- DeepSeek R1T Chimera ist über OpenRouter verfügbar (nicht direkt über DeepSeek API)
- .env-Datei im Root-Verzeichnis enthält den API-Key
- .env wird NICHT ins Git committed (siehe .gitignore)

Backend starten:
1. cd backend
2. pip install -r requirements.txt
3. python main.py oder uvicorn main:app --reload
"""

import os
import json
import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import HTMLResponse


# .env-Datei laden (aus Root-Verzeichnis oder aktueller Working-Dir)
load_dotenv()

# OpenRouter API-Key aus Umgebungsvariable lesen
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise RuntimeError(
        "OPENROUTER_API_KEY ist nicht gesetzt. "
        "Bitte in .env-Datei im Root-Verzeichnis eintragen: OPENROUTER_API_KEY=dein_key_hier"
    )

# Debug: Prüfen ob Key geladen wurde (nur erste Zeichen anzeigen)
print(f"✓ OpenRouter API-Key geladen: {api_key[:10]}...")

# OpenRouter-Konfiguration
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "arcee-ai/trinity-large-preview:free"

print("✓ OpenRouter-Konfiguration geladen")
print(f"✓ URL: {OPENROUTER_URL}")
print(f"✓ Modell: {OPENROUTER_MODEL}")

# FastAPI-App erstellen
app = FastAPI(
    title="AIVA-Train Backend",
    description="Backend für AIVA-Train Chat-UI mit DeepSeek R1T Chimera Integration (über OpenRouter)",
    version="1.0.0",
)


@app.on_event("startup")
async def startup_event():
    print("🚀 Backend ist bereit und empfängt Anfragen!")


# CORS aktivieren - erlaubt Frontend-Zugriff von verschiedenen Origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Für Entwicklung ok, später einschränken
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)
print("✅ CORS-Middleware aktiviert")


# Logging-Middleware
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        print(f"🌐 {request.method} {request.url.path}")
        response = await call_next(request)
        print(f"🌐 Response Status: {response.status_code}")
        return response


app.add_middleware(LoggingMiddleware)


# Pydantic-Modelle für Request/Response
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str

from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <h1>AIVA-Train Backend läuft ✅</h1>
    <p>API-Endpoints:</p>
    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/test">/test</a></li>
      <li><a href="/test-api">/test-api</a></li>
      <li><a href="/docs">/docs (Swagger UI)</a></li>
    </ul>
    """


@app.get("/health")
async def health_check():
    print("✅ Health-Check aufgerufen")
    return {"status": "ok", "message": "AIVA-Train Backend läuft"}


@app.get("/api/ping")
async def ping():
    print("✅ Ping-Endpoint aufgerufen")
    return {"status": "ok", "message": "Backend ist erreichbar"}


@app.post("/api/chat-test", response_model=ChatResponse)
async def chat_test(req: ChatRequest):
    """
    Test-Endpoint der sofort antwortet (ohne API-Call),
    um Frontend/Backend-Verbindung zu prüfen.
    """
    print(f"✅ Test-Endpoint aufgerufen mit Nachricht: {req.message}")
    return ChatResponse(
        answer=f"✅ Test erfolgreich! Deine Nachricht war: '{req.message}'. Das Backend funktioniert."
    )


@app.get("/test")
async def test_endpoint():
    """
    Test-Endpoint für Debugging
    """
    return {
        "status": "ok",
        "backend": "läuft",
        "api_key_loaded": bool(api_key),
        "api_key_preview": api_key[:15] + "..." if api_key else "NICHT GELADEN",
        "api_key_length": len(api_key) if api_key else 0,
        "base_url": OPENROUTER_URL,
        "model": OPENROUTER_MODEL,
        "note": "Verwendet direkte requests-Implementierung für OpenRouter",
    }


@app.get("/test-api")
async def test_api_call():
    """
    Test-Endpoint der einen echten API-Call macht
    """
    try:
        print("🧪 Teste OpenRouter API-Call...")

        test_response = requests.post(
            url=OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",  # optional
                "X-Title": "AIVA-Train",  # optional
            },
            data=json.dumps(
                {
                    "model": OPENROUTER_MODEL,
                    "messages": [
                        {
                            "role": "user",
                            "content": "Antworte nur mit: Test erfolgreich",
                        }
                    ],
                    "max_tokens": 50,
                }
            ),
            timeout=30,
        )

        print(f"📡 Test HTTP Status: {test_response.status_code}")
        print(f"📡 Test Response: {test_response.text[:200]}")

        if test_response.status_code == 200:
            response_data = test_response.json()
            answer = (
                response_data.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "Keine Antwort")
            )
            return {
                "status": "success",
                "message": "API-Call erfolgreich",
                "http_status": test_response.status_code,
                "response": answer,
            }
        else:
            return {
                "status": "error",
                "message": "API-Call fehlgeschlagen",
                "http_status": test_response.status_code,
                "error": test_response.text,
            }

    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        print(f"❌ Test-Fehler: {str(e)}")
        print(f"❌ Traceback: {error_details}")
        return {
            "status": "error",
            "message": str(e),
            "error_type": type(e).__name__,
            "traceback": error_details,
        }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Chat-Endpoint mit DeepSeek R1T Chimera (über OpenRouter)
    """
    print("=" * 50)
    print("📨 NEUE ANFRAGE ERHALTEN!")
    print(f"📨 Request Body: {req}")
    print("=" * 50)

    user_message = req.message.strip()
    print(f"📝 User-Nachricht: {user_message}")

    if not user_message:
        return ChatResponse(answer="Bitte gib eine Nachricht ein 🙂")

    system_prompt = """Du bist AIVA, ein freundlicher und klarer KI-Avatar.

Regeln:
- Antworte auf Deutsch.
- Erkläre Dinge einfach und konkret.
- Halte dich kurz (2–5 Sätze).
"""

    try:
        print(f"📤 Sende Anfrage an OpenRouter: {user_message[:50]}...")

        response = requests.post(
            url=OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "AIVA-Train",
            },
            data=json.dumps(
                {
                    "model": OPENROUTER_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 300,
                }
            ),
            timeout=60,
        )

        print(f"📡 HTTP Status: {response.status_code}")

        if response.status_code != 200:
            error_text = response.text
            print(f"❌ HTTP Fehler: {error_text}")
            raise Exception(
                f"OpenRouter API Fehler {response.status_code}: {error_text}"
            )

        response_data = response.json()
        print("✅ Antwort von OpenRouter erhalten")

        if "choices" not in response_data or len(response_data["choices"]) == 0:
            raise Exception("Keine Antwort in der Response gefunden")

        answer = response_data["choices"][0]["message"]["content"].strip()
        print(f"📥 Antwort: {answer[:100]}...")

        return ChatResponse(answer=answer)

    except requests.exceptions.Timeout:
        print("❌ Timeout: OpenRouter hat nicht rechtzeitig geantwortet")
        return ChatResponse(
            answer="Die Anfrage hat zu lange gedauert. Bitte versuch es erneut."
        )
    except requests.exceptions.ConnectionError:
        print("❌ Verbindungsfehler: Konnte nicht zu OpenRouter verbinden")
        return ChatResponse(
            answer="Verbindungsfehler zur KI-API. Bitte prüfe deine Internetverbindung."
        )
    except Exception as e:
        import traceback

        error_message = str(e)
        error_type = type(e).__name__
        print("❌ Fehler beim DeepSeek R1T Chimera API-Aufruf:")
        print(f"   Typ: {error_type}")
        print(f"   Nachricht: {error_message}")
        print("   Traceback:")
        traceback.print_exc()

        return ChatResponse(
            answer=f"Fehler beim KI-Aufruf: {error_message}. Bitte Backend-Logs prüfen."
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
