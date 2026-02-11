// ========== AIVA Chat – Anbindung an POST /api/chat ==========
const CHAT_API = "http://127.0.0.1:8000/api/chat";

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const avatar = document.getElementById("avatar");

if (window.location.protocol === "file:") {
    console.warn("⚠️ Frontend läuft über file:// – fetch() kann fehlschlagen. Bitte per HTTP-Server öffnen (z.B. python -m http.server 5500).");
}

/**
 * Fügt eine Nachricht als Bubble in den Chat ein.
 * @param {string} text - Nachrichtentext
 * @param {"user"|"bot"} sender - "user" = rechte Bubble, "bot" = linke Bubble
 * @returns {HTMLElement} Das erstellte Message-Wrapper-Element (für ggf. späteres Entfernen)
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
 * Sendet die Nachricht an das Backend und zeigt die KI-Antwort an.
 * Analog zu test-chat.html, mit freundlichen Fehlermeldungen für den User.
 * @param {string} message - Vom User eingegebener Text
 */
async function sendMessageToBackend(message) {
    addMessage(message, "user");
    chatInput.value = "";

    if (avatar) avatar.classList.add("thinking");

    const sendButton = document.querySelector(".chatbot-send-btn");
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
            return;
        }

        const data = await res.json();
        if (data.answer != null) {
            addMessage(data.answer, "bot");
        } else {
            addMessage("Keine Antwort erhalten. Bitte erneut versuchen.", "bot");
        }
    } catch (err) {
        console.error("Fetch-Error:", err);
        addMessage(
            "Verbindungsfehler. Bitte prüfe, ob das Backend auf http://127.0.0.1:8000 läuft.",
            "bot"
        );
    } finally {
        if (avatar) avatar.classList.remove("thinking");
        if (sendButton) sendButton.disabled = false;
        chatInput.focus();
    }
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

// Smooth Scroll für Anker-Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});
