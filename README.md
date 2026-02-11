# AIVA-Train - Landingpage & Chat-UI

Landingpage und Chat-Interface für AIVA-Train - KI-Avatar für Software-Onboarding

## Projekt-Struktur

```
aiva-chat-v1/
├── backend/              # FastAPI Backend
│   ├── main.py          # FastAPI-App mit /api/chat Endpoint
│   ├── requirements.txt # Python Dependencies
│   └── README.md        # Backend-Dokumentation
├── images/              # Bilder (Avatar, etc.)
├── index.html           # Landingpage mit Chat-UI
├── styles.css           # Haupt-Stylesheet
├── script.js            # Frontend JavaScript (Backend-Integration)
└── README.md            # Diese Datei
```

## Frontend starten

### Option 1: Python HTTP Server
```bash
# Im Projekt-Root
python -m http.server 5500
```
Dann öffnen: `http://localhost:5500`

### Option 2: Live Server (VS Code Extension)
- Rechtsklick auf `index.html` → "Open with Live Server"

### Option 3: Direkt im Browser
- Einfach `index.html` im Browser öffnen (funktioniert, aber Backend-Calls funktionieren nur mit CORS-freundlichem Server)

## Backend starten

1. Backend-Verzeichnis öffnen:
   ```bash
   cd backend
   ```

2. Dependencies installieren:
   ```bash
   pip install -r requirements.txt
   ```

3. Backend starten:
   ```bash
   uvicorn main:app --reload
   ```

Das Backend läuft dann auf: `http://localhost:8000`

- API-Dokumentation: `http://localhost:8000/docs`
- Health-Check: `http://localhost:8000/health`

## Verwendung

1. **Backend starten** (siehe oben)
2. **Frontend öffnen** (siehe oben)
3. **Chat testen:**
   - Auf der Landingpage nach unten scrollen zur Chatbot-Section
   - Eine Nachricht eingeben und senden
   - Die Nachricht wird an das Backend gesendet
   - Das Backend antwortet mit einer Demo-Antwort

## Wichtige Hinweise

### Backend-URL anpassen
Falls das Backend auf einem anderen Port läuft, die URL in `script.js` anpassen:
```javascript
const BACKEND_URL = 'http://localhost:8000'; // Hier anpassen
```

### CORS
Das Backend erlaubt aktuell alle Origins (`*`). Für Produktion sollte dies auf spezifische Frontend-URLs beschränkt werden.

### Demo-Modus
- **Keine API-Keys nötig:** Diese Version benötigt keine OpenAI-API-Keys
- **100% kostenlos:** Keine API-Kosten
- **Demo-Antworten:** Das Backend gibt feste Demo-Antworten zurück

## Spätere KI-Integration

Die echte KI-Integration kann später in `backend/main.py` hinzugefügt werden.
Siehe Kommentare im Code für Details.

## Technologie-Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Python, FastAPI, Uvicorn
- **Keine Frameworks:** Kein React, Vue, etc. - nur Vanilla JS

## Entwicklung

### Backend-Entwicklung
- Backend-Code: `backend/main.py`
- Dependencies: `backend/requirements.txt`
- API-Docs: `http://localhost:8000/docs` (wenn Backend läuft)

### Frontend-Entwicklung
- HTML: `index.html`
- Styles: `styles.css`
- JavaScript: `script.js`

## Troubleshooting

### Backend-Calls funktionieren nicht
1. Prüfen, ob Backend läuft: `http://localhost:8000/health`
2. Browser-Konsole öffnen (F12) und Fehler prüfen
3. CORS-Fehler? → Backend muss laufen und CORS muss aktiviert sein

### Frontend lädt nicht richtig
- Live Server verwenden statt direktes Öffnen von `index.html`
- Oder Python HTTP Server verwenden

### Backend startet nicht
- Python-Version prüfen (Python 3.7+)
- Dependencies installieren: `pip install -r backend/requirements.txt`
- Port 8000 bereits belegt? → Anderen Port verwenden: `uvicorn main:app --reload --port 8001`
