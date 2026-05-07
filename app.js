/ Nova AI - Chat Application

const RESPONSES = [
  "That's a great question! Nova AI is here to help with writing, coding, brainstorming, and much more.",
  "I understand what you're looking for. Let me help you navigate this step by step.",
  "Interesting! Based on what you've shared, the best approach is to break this down systematically.",
  "Great point! Let me provide a comprehensive answer covering the key aspects you need.",
  "Thanks for asking! This is a fascinating topic. There are several important things to consider...",
  "Of course! Here's what I know, along with some practical suggestions you might find helpful.",
  "That's thoughtful. The answer depends on a few factors, but generally the most effective approach is to understand the core principles first.",
  "Absolutely! I'll walk you through the process step by step to make sure everything is clear.",
  "I appreciate you sharing that. Based on what you've described, I have a few ideas that might work well.",
  "Sure! The key is to focus on what matters most and iterate from there. Want me to elaborate?"
];

let chatHistory = JSON.parse(localStorage.getItem('nova_history') || '[]');
let currentSession = [];
let isTyping = false;

const chatContainer = document.getElementById('chatContainer');
const messagesWrapper = document.getElementById('messagesWrapper');
const welcomeScreen = document.getElementById('welcomeScreen');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const historyList = document.getElementById('historyList');

function init() {
  renderHistory();
  messageInput.focus();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function newChat() {
  if (currentSession.length > 0) saveSession();
  currentSession = [];
  messagesWrapper.innerHTML = '';
  welcomeScreen.style.display = 'flex';
  messageInput.value = '';
  autoResize(messageInput);
}

function saveSession() {
  if (!currentSession.length) return;
  const first = currentSession.find(m => m.role === 'user');
  if (!first) return;
  const title = first.content.length > 40 ? first.content.slice(0, 40) + '...' : first.content;
  chatHistory.unshift({ title, messages: [...currentSession], time: Date.now() });
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(0, 20);
  localStorage.setItem('nova_history', JSON.stringify(chatHistory));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  chatHistory.slice(0, 10).forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = s.title;
    item.title = s.title;
    item.onclick = () => loadSession(i);
    historyList.appendChild(item);
  });
}

function loadSession(index) {
  const session = chatHistory[index];
  currentSession = [...session.messages];
  welcomeScreen.style.display = 'none';
  messagesWrapper.innerHTML = '';
  session.messages.forEach(m => renderMessage(m.role, m.content));
  scrollToBottom();
}

function useSuggestion(btn) {
  const text = btn.querySelector('span:last-child').textContent;
  messageInput.value = text;
  autoResize(messageInput);
  messageInput.focus();
}

function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || isTyping) return;
  welcomeScreen.style.display = 'none';
  addMessage('user', text);
  messageInput.value = '';
  autoResize(messageInput);
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage('assistant', generateResponse(text));
  }, 800 + Math.random() * 1200);
}

function addMessage(role, content) {
  currentSession.push({ role, content });
  renderMessage(role, content);
  scrollToBottom();
  if (currentSession.length === 2) saveSession();
}

function renderMessage(role, content) {
  const wrap = document.createElement('div');
  wrap.className = 'message ' + role;
  const av = document.createElement('div');
  av.className = 'message-avatar';
  av.textContent = role === 'user' ? 'U' : '\u2728';
  const mc = document.createElement('div');
  mc.className = 'message-content';
  const rl = document.createElement('div');
  rl.className = 'message-role';
  rl.textContent = role === 'user' ? 'You' : 'Nova';
  const tx = document.createElement('div');
  tx.className = 'message-text';
  tx.textContent = content;
  mc.appendChild(rl);
  mc.appendChild(tx);
  wrap.appendChild(av);
  wrap.appendChild(mc);
  messagesWrapper.appendChild(wrap);
}

function showTyping() {
  isTyping = true;
  sendBtn.disabled = true;
  const ind = document.createElement('div');
  ind.className = 'message assistant';
  ind.id = 'typingIndicator';
  const av = document.createElement('div');
  av.className = 'message-avatar';
  av.textContent = '\u2728';
  const mc = document.createElement('div');
  mc.className = 'message-content';
  const rl = document.createElement('div');
  rl.className = 'message-role';
  rl.textContent = 'Nova';
  const dots = document.createElement('div');
  dots.className = 'typing-indicator';
  dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  mc.appendChild(rl);
  mc.appendChild(dots);
  ind.appendChild(av);
  ind.appendChild(mc);
  messagesWrapper.appendChild(ind);
  scrollToBottom();
}

function hideTyping() {
  isTyping = false;
  sendBtn.disabled = false;
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function generateResponse(text) {
  const t = text.toLowerCase();
  if (/hello|hi|hey/.test(t)) return "Hello! Great to meet you. I'm Nova, your AI assistant. How can I help you today?";
  if (/how are you|how r u/.test(t)) return "I'm doing wonderfully, thank you! I'm Nova, always ready to help. What can I assist you with?";
  if (/your name|who are you|what are you/.test(t)) return "I'm Nova \u2728 — an AI assistant for writing, coding, brainstorming, research, and more. Your intelligent companion for any challenge!";
  if (/thank/.test(t)) return "You're very welcome! It's always a pleasure to help. Is there anything else I can assist you with?";
  if (/joke|funny/.test(t)) return "Why do programmers prefer dark mode? Because light attracts bugs! \ud83d\ude04 Want to hear another one?";
  if (/weather/.test(t)) return "I don't have real-time weather data, but I recommend checking weather.com for accurate forecasts in your area!";
  if (/code|program|javascript|python/.test(t)) return "I love helping with code! Share the specific code or describe what you'd like to build and I'll guide you step by step.";
  if (/write|essay|email/.test(t)) return "Writing is one of my strengths! Tell me the topic, tone, length, and audience, and I'll craft something great for you.";
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);
