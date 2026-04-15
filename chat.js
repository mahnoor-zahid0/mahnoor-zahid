import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Employee Chat Logic - Gemini Integration
 * Uses the Google Generative AI SDK to provide a live brain for the assistant.
 */

const API_KEY = "INSERT_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt to ground the AI in the portfolio context
const SYSTEM_PROMPT = `
You are the AI Assistant for Mahnoor Zahid's professional portfolio. 
Mahnoor is a Software Engineer specializing in high-performance Web and Mobile applications.

TECHNICAL SKILLS:
- Frontend: React, Next.js, Three.js, WebGL, Tailwind CSS
- Mobile: Flutter, Dart, React Native
- Backend: Node.js, Python, Firebase, Express
- Tools: Git, Adobe Creative Suite, 3D Modeling (Blender)

FEATURED PROJECTS:
1. E-Commerce Platform: A robust full-stack solution featuring product catalogs, payment gateway integration, and a dynamic user dashboard (Built with React, Node.js).
2. Mobile App: A cross-platform mobile application utilizing Flutter, featuring AR furniture placement and property listings.
3. 3D Portfolio: The very website you are on! An interactive 3D universe built with Three.js and WebGL.

YOUR PERSONALITY:
- Professional yet approachable.
- Enthusiastic about technology and design.
- Helpful and concise in your responses.

YOUR GOAL:
- Help visitors understand Mahnoor's expertise.
- Provide details about specific projects when asked.
- Direct users to the contact form or CV download if they are interested in hiring/consultation.

IMPORTANT: Keep your responses relatively short (less than 3 sentences unless asked for detail).
`;

document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT 
    });

    // Chat History for persistent conversation
    let chat = model.startChat({
        history: [],
    });

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle Form Submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to UI
        addMessage(message, 'input');
        chatInput.value = '';

        // Add loading indicator
        const loadingId = addLoading();

        try {
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();
            
            removeLoading(loadingId);
            addMessage(text, 'output');
            
        } catch (error) {
            removeLoading(loadingId);
            addMessage('I am having a bit of trouble connecting to my brain. Please try again or use the traditional contact form!', 'output');
            console.error('Gemini API Error:', error);
        }
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addLoading() {
        const id = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = id;
        loadingDiv.className = 'message output loading';
        loadingDiv.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});
