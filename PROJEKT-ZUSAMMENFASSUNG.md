# AIVA-Train Landingpage - Projekt-Zusammenfassung

## Projekt-Übersicht
**Projektname:** AIVA-Train  
**Typ:** Statische Landingpage (Frontend-only, kein Backend)  
**Zweck:** Marketing-Landingpage für ein KI-Avatar-Produkt für Software-Onboarding  
**Technologie-Stack:** HTML5, CSS3, Vanilla JavaScript (kein Framework)

---

## Projekt-Struktur

```
aiva-chat-v1/
├── index.html          # Haupt-HTML-Datei mit kompletter Seitenstruktur
├── styles.css          # Haupt-CSS-Datei mit allen Styles
├── script.js           # JavaScript für Chatbot-Demo-Funktionalität
├── style.css           # Alte CSS-Datei (nicht verwendet)
└── images/
    └── avatar-hero.png  # Avatar-Bild für Hero-Bereich
```

---

## Seiten-Struktur (index.html)

### 1. Header / Navigation
- **Sticky Header** mit Backdrop-Filter (Blur-Effekt)
- **Logo:** Runder grüner Kreis mit "A" + Text "AIVA-Train"
- **Navigation:** 4 Links (Produkt, Avatar, Chatbot, Über Uns)
  - Aktiver Link wird mit grüner Farbe und höherem Font-Weight markiert
- **Header-Buttons:** 
  - "Demo ansehen" (Outline-Button)
  - "Kostenfrei testen" (Violetter Primary-Button)

### 2. Hero-Section
**Layout:** 60/40 Split (links Text, rechts Avatar)

**Linke Seite (60%):**
- Hintergrund: Kräftiges Lime-Grün (`#84cc16`)
- Große Headline: "AIVA-Train: Dein KI-Avatar für Software-Onboarding"
  - Typografie: 56px, Font-Weight 700, Letter-Spacing -0.02em
- Subheadline: Beschreibungstext in weiß
- CTA-Button: "Jetzt unverbindlich anfragen" (violett/lila)

**Rechte Seite (40%):**
- Hintergrund: Helles Grün (`#d9f99d`)
- Avatar-Bild: `./images/avatar-hero.png`
  - Mit Glow-Effekten und Animationen
  - Pulsierender Hintergrund-Glow
  - Augen-Glow-Effekt (animiert)
  - Float-Animation (sanftes Schweben)

### 3. Avatar-Section
- Überschrift: "Dein KI-Avatar"
- 3 Feature-Cards mit Icons:
  - 🎙️ Natürliche Lippenbewegung
  - 📹 Kamera-Interaktion
  - 🧠 RAG-Wissen
- Kleiner Avatar-Visual (CSS-generiert)

### 4. Chatbot-Preview-Section
- Überschrift + Subtitle
- Interaktiver Chatbot-Demo:
  - Scrollbarer Chat-Container
  - Eingabefeld + Senden-Button
  - Dummy-Bot-Antworten (kein echtes Backend)
  - JavaScript-Funktionalität in `script.js`

---

## Design-System (styles.css)

### Farbpalette
- **Primär-Grün:** `#84cc16` (Lime-Grün)
- **Helles Grün:** `#d9f99d` (für rechte Hero-Seite)
- **Violett:** `#7c3aed` (für CTA-Buttons)
- **Weiß:** `#ffffff` (für Text auf grünem Hintergrund)

### Typografie
- **Font-Family:** system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Hero-Headline:** 56px, Font-Weight 700, Line-Height 1.2
- **Subheadline:** 18px, Line-Height 1.7
- **Body-Text:** 15-16px

### Wichtige CSS-Klassen

#### Header
- `.main-header` - Sticky Header mit Blur
- `.nav-link.active` - Aktiver Navigationspunkt
- `.nav-btn`, `.nav-btn-outline`, `.nav-btn-primary` - Vereinheitlichte Button-Stile

#### Hero
- `.hero` - Haupt-Container mit Gradient-Hintergrund
- `.hero-left` - Linke Spalte (Text-Bereich)
- `.hero-right` - Rechte Spalte (Avatar-Bereich)
- `.hero-title` - Große Headline
- `.hero-subtitle` - Subheadline
- `.btn-cta` - Call-to-Action Button

#### Avatar
- `.avatar-card` - Container für Avatar-Bild
- `.avatar-hero-container` - Innerer Container
- `.avatar-hero-image` - Das Avatar-Bild selbst
- `.avatar-hero-overlay` - Grüner Gradient-Overlay
- `.avatar-glow` - Pulsierender Glow-Effekt

#### Chatbot
- `.chatbot-demo` - Demo-Container
- `.chatbot-container` - Scrollbarer Chat-Bereich
- `.chatbot-bubble` - Chat-Nachrichten-Bubbles
- `.chatbot-form` - Eingabeformular

### Animationen
- `@keyframes float` - Sanftes Schweben (6s Loop)
- `@keyframes pulse-glow` - Pulsierender Glow-Effekt (3s Loop)
- `@keyframes eye-glow` - Augen-Glow-Animation (2s Loop)
- `@keyframes fadeIn` - Fade-In für Chat-Nachrichten

---

## JavaScript-Funktionalität (script.js)

### Chatbot-Demo
- **Form-Submit-Handler:** Verhindert Standard-Submit, fügt User-Nachricht hinzu
- **Dummy-Bot-Antwort:** Nach 500ms wird eine feste Antwort angezeigt
- **Auto-Scroll:** Chat scrollt automatisch nach unten bei neuen Nachrichten
- **Enter-Taste:** Sendet Nachricht (Shift+Enter für neue Zeile)

### Navigation
- **Smooth-Scroll:** Alle Anchor-Links scrollen sanft zu Ziel-Sektionen

---

## Responsive Design

### Breakpoints
- **Desktop:** > 900px - 60/40 Split Layout
- **Tablet:** ≤ 900px - Einspaltiges Layout (Text oben, Avatar unten)
- **Mobile:** ≤ 640px - Kompaktes Layout, kleinere Typografie

### Mobile-Anpassungen
- Hero-Hintergrund wird vertikal (oben grün, unten hell)
- Navigation-Links werden kleiner
- Buttons werden vollbreit
- Avatar-Bild zentriert
- Paddings reduziert

---

## Design-Entscheidungen

### 1. Hero-Bereich
- **Inspiration:** Referenz-Design ähnlich "comdesk VoiceAgent"
- **Zweigeteilter Hintergrund:** Kräftiges Grün links, helles Grün rechts
- **Avatar-Position:** Linksbündig im rechten Bereich
- **Glow-Effekte:** Mehrschichtige Glow-Effekte für futuristischen Look

### 2. Typografie
- **SaaS-Stil:** Große, fette Headlines mit engem Letter-Spacing
- **Lesbarkeit:** Max-Width für Subheadlines, gute Line-Height

### 3. Buttons
- **Vereinheitlicht:** Gemeinsame `.nav-btn` Klasse mit Varianten
- **Hover-Effekte:** Transform und Shadow-Änderungen

### 4. Avatar-Visual
- **Hochwertig:** Große Border-Radius, mehrschichtige Schatten
- **Interaktiv:** Hover-Animation mit leichtem Schweben
- **Futuristisch:** Glow-Effekte, Overlays, Animationen

---

## Technische Details

### Browser-Kompatibilität
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Backdrop-Filter für Blur-Effekte
- CSS Grid für Layout
- CSS Custom Properties könnten verwendet werden (aktuell nicht)

### Performance
- Keine externen Dependencies
- Optimierte CSS-Animationen (transform, opacity)
- Lazy-Loading für Bilder möglich (aktuell nicht implementiert)

### Zugänglichkeit
- Semantisches HTML5
- Alt-Texte für Bilder
- Keyboard-Navigation unterstützt

---

## Erweiterungsmöglichkeiten

### Backend-Integration
- Chatbot-Formular: `fetch()` zu `/api/chat` hinzufügen
- Avatar-Bild: Dynamisch laden oder Video-Stream integrieren

### Weitere Features
- Mehrsprachigkeit (aktuell nur Deutsch)
- Dark/Light Mode Toggle
- Animierte Scroll-Indikatoren
- Parallax-Effekte

---

## Wichtige Hinweise

1. **Kein Backend:** Alle Funktionalität ist Frontend-only
2. **Dummy-Antworten:** Chatbot zeigt feste Platzhalter-Text
3. **Bild-Pfad:** Avatar-Bild muss unter `./images/avatar-hero.png` liegen
4. **Kein Build-Prozess:** Direktes HTML/CSS/JS, kein Bundler nötig

---

## Entwicklungs-Historie

1. **Phase 1:** Grundlegende Landingpage-Struktur erstellt
2. **Phase 2:** Avatar-Bild Integration im Hero-Bereich
3. **Phase 3:** Design-Finishing (Typografie, Avatar-Card, Chat-Preview)
4. **Phase 4:** Anpassung an Referenz-Design (60/40 Split, Farben, Glow-Effekte)

---

## Nächste Schritte (Optional)

- [ ] Backend-Integration für Chatbot
- [ ] Echte KI-Anbindung
- [ ] Video-Integration für Avatar
- [ ] Analytics-Integration
- [ ] A/B-Testing Setup
- [ ] SEO-Optimierung

