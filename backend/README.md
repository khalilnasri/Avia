# AIVA-Train Backend

FastAPI-Backend für die AIVA-Train Chat-UI mit DeepSeek R1T Chimera Integration

## Installation

1. **API-Key konfigurieren:**
   - Erstelle eine `.env`-Datei im **Root-Verzeichnis** (nicht im backend-Ordner!)
   - Füge folgende Zeile ein (DeepSeek verwendet OpenAI-kompatible API):
     ```
     OPENAI_API_KEY=dein_deepseek_api_key_hier
     ```
   - **WICHTIG:** Die `.env`-Datei wird NICHT ins Git committed (siehe `.gitignore`)

2. Backend-Verzeichnis öffnen:
   ```bash
   cd backend
   ```

3. Virtuelle Umgebung erstellen (optional, aber empfohlen):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

4. Dependencies installieren:
   ```bash
   pip install -r requirements.txt
   ```

## Backend starten

```bash
uvicorn main:app --reload
```

Das Backend läuft dann auf: `http://localhost:8000`

- API-Dokumentation: `http://localhost:8000/docs` (Swagger UI)
- Alternative API-Docs: `http://localhost:8000/redoc`

## Endpoints

### GET /health
Health-Check Endpoint
- Response: `{"status": "ok", "message": "AIVA-Train Backend läuft"}`

### POST /api/chat
Chat-Endpoint für User-Nachrichten

**Request:**
```json
{
  "message": "Hallo, wie funktioniert das?"
}
```

**Response:**
```json
{
  "answer": "(Demo) Ich bin die kostenlose AIVA-Train-Test-KI..."
}
```

## Wichtig

- **API-Key erforderlich:** Das Backend benötigt einen DeepSeek-API-Key in der `.env`-Datei
- **API-Kosten:** Jede Anfrage verursacht Kosten bei DeepSeek (abhängig vom Modell)
- **Modell:** Aktuell wird `deepseek-reasoner` (DeepSeek R1T Chimera) verwendet
- **Sicherheit:** Der API-Key steht NUR in der `.env`-Datei, NICHT im Code
- **API-Kompatibilität:** DeepSeek verwendet eine OpenAI-kompatible API-Struktur

## Konfiguration

### DeepSeek-Modell ändern
In `main.py` im `chat()` Endpoint kannst du das Modell ändern:
- `deepseek-reasoner` - DeepSeek R1T Chimera (aktuell verwendet)
- `deepseek-chat` - Standard DeepSeek Chat-Modell
- Weitere Modelle siehe: https://api-docs.deepseek.com/

### Prompt anpassen
Der System-Prompt in `main.py` definiert das Verhalten von AIVA.
Du kannst ihn anpassen, um andere Antwortstile zu erhalten.

## CORS

Aktuell sind alle Origins erlaubt (`allow_origins=["*"]`). 
Für Produktion sollte dies auf spezifische Frontend-URLs beschränkt werden.
