// ========== AIVA Avatar + Voice Demo ==========
const CHAT_API = "http://127.0.0.1:8000/api/chat";

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const avatar = document.getElementById("aivaOrb");
const ttsToggle = document.getElementById("tts-toggle");

let ttsEnabled = true;
let currentUtterance = null;

// Warnung bei file:// Protokoll
if (window.location.protocol === "file:") {
    console.warn("⚠️ Frontend läuft über file:// – fetch() kann fehlschlagen. Bitte per HTTP-Server öffnen (z.B. python -m http.server 5500).");
}

// Prüfe ob Web Speech API verfügbar ist
const speechSynthesisAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
if (!speechSynthesisAvailable) {
    console.warn("⚠️ Web Speech API nicht verfügbar. Text-to-Speech wird nicht funktionieren.");
    if (ttsToggle) {
        ttsToggle.disabled = true;
        ttsToggle.title = "Text-to-Speech nicht verfügbar";
    }
}

/**
 * Initialisiert den Avatar mit Augen und Mund.
 */
function initAvatar() {
    if (!avatar) return;
    
    avatar.innerHTML = '';
    
    const leftEye = document.createElement("div");
    leftEye.className = "eye left";
    
    const rightEye = document.createElement("div");
    rightEye.className = "eye right";
    
    const mouth = document.createElement("div");
    mouth.className = "mouth";
    
    avatar.appendChild(leftEye);
    avatar.appendChild(rightEye);
    avatar.appendChild(mouth);
    
    setAvatarState("idle");
}

/**
 * Setzt den Avatar-State (idle, thinking, speaking).
 * @param {string} state - "idle" | "thinking" | "speaking"
 */
function setAvatarState(state) {
    if (!avatar) return;
    
    avatar.classList.remove("idle", "thinking", "speaking");
    
    if (state === "idle" || state === "thinking" || state === "speaking") {
        avatar.classList.add(state);
    }
}

/**
 * Fügt eine Nachricht als Bubble in den Chat ein.
 * @param {string} text - Nachrichtentext
 * @param {"user"|"bot"} sender - "user" = rechte Bubble, "bot" = linke Bubble
 * @returns {HTMLElement} Das erstellte Message-Wrapper-Element
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chatbot-message ${sender}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chatbot-bubble";
    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

/**
 * Liest Text laut vor mit Web Speech API.
 * @param {string} text - Der zu sprechende Text
 */
function speak(text) {
    if (!ttsEnabled || !speechSynthesisAvailable) {
        return;
    }

    try {
        // Stoppe vorherige Ausgabe
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "de-DE";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setAvatarState("speaking");
        };

        utterance.onend = () => {
            setAvatarState("idle");
            currentUtterance = null;
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error:", event);
            setAvatarState("idle");
            currentUtterance = null;
        };

        currentUtterance = utterance;
        speechSynthesis.speak(utterance);
    } catch (err) {
        console.error("Fehler beim Text-to-Speech:", err);
        setAvatarState("idle");
    }
}

/**
 * Sendet die Nachricht an das Backend und zeigt die KI-Antwort an.
 * @param {string} message - Vom User eingegebener Text
 */
async function sendMessageToBackend(message) {
    addMessage(message, "user");
    chatInput.value = "";

    setAvatarState("thinking");

    if (sendButton) sendButton.disabled = true;

    try {
        const res = await fetch(CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Backend-Fehler:", res.status, errText);

            let userMessage;
            if (res.status === 429) {
                userMessage = "Die KI ist gerade ausgelastet. Bitte versuche es in ein paar Sekunden erneut.";
            } else if (res.status >= 500) {
                userMessage = "Der Server ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.";
            } else {
                userMessage = "Etwas ist schiefgelaufen. Bitte versuche es später erneut.";
            }
            addMessage(userMessage, "bot");
            setAvatarState("idle");
            return;
        }

        const data = await res.json();
        if (data.answer != null) {
            addMessage(data.answer, "bot");
            speak(data.answer);
        } else {
            const errorMsg = "Keine Antwort erhalten. Bitte erneut versuchen.";
            addMessage(errorMsg, "bot");
            setAvatarState("idle");
        }
    } catch (err) {
        console.error("Fetch-Error:", err);
        const errorMsg = "Verbindungsfehler. Bitte prüfe, ob das Backend auf http://127.0.0.1:8000 läuft.";
        addMessage(errorMsg, "bot");
        setAvatarState("idle");
    } finally {
        if (sendButton) sendButton.disabled = false;
        chatInput.focus();
    }
}

// TTS Toggle Handler
if (ttsToggle) {
    ttsToggle.addEventListener("click", () => {
        ttsEnabled = !ttsEnabled;
        
        if (!ttsEnabled) {
            // Stoppe aktuelle Ausgabe
            if (speechSynthesisAvailable) {
                speechSynthesis.cancel();
            }
            ttsToggle.textContent = "🔇";
            ttsToggle.classList.add("muted");
            setAvatarState("idle");
        } else {
            ttsToggle.textContent = "🔊";
            ttsToggle.classList.remove("muted");
        }
    });
}

// Formular: Senden ohne Seiten-Reload
if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        sendMessageToBackend(text);
    });
}

// Enter im Eingabefeld löst Submit aus
if (chatInput && chatForm) {
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event("submit"));
        }
    });
}

// Avatar initialisieren wenn DOM geladen ist
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAvatar);
} else {
    initAvatar();
}

