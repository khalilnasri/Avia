// Chatbot Preview Funktionalität
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotContainer = document.getElementById('chatbotContainer');

// Dummy-Antwort für den Bot
const dummyBotResponse = "Ich bin noch nicht mit der KI verbunden – das Backend kommt in der nächsten Version 😄";

// Funktion zum Hinzufügen einer Nachricht im Chatbot
function addChatbotMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chatbot-bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    chatbotContainer.appendChild(messageDiv);
    
    // Nach unten scrollen
    scrollChatbotToBottom();
}

// Funktion zum Scrollen nach unten im Chatbot
function scrollChatbotToBottom() {
    chatbotContainer.scrollTop = chatbotContainer.scrollHeight;
}

// Event Listener für das Chatbot-Formular
if (chatbotForm) {
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatbotInput.value.trim();
        
        if (!message) {
            return;
        }
        
        // User-Nachricht hinzufügen
        addChatbotMessage(message, 'user');
        
        // Input leeren
        chatbotInput.value = '';
        
        // Bot-Antwort nach kurzer Verzögerung hinzufügen
        setTimeout(() => {
            addChatbotMessage(dummyBotResponse, 'bot');
        }, 500);
    });
}

// Enter-Taste im Chatbot-Input
if (chatbotInput) {
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatbotForm.dispatchEvent(new Event('submit'));
        }
    });
}

// Smooth Scroll für Navigation-Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
