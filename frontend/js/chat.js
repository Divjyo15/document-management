// js/chat.js
const API_URL = 'http://localhost:5000/api';

const chatMessages = document.getElementById('chatMessages');
const questionInput = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');

// Send question
sendBtn.addEventListener('click', sendQuestion);
questionInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendQuestion();
  }
});

async function sendQuestion() {
  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  // Add user message to chat
  addMessage(question, 'user');
  questionInput.value = '';

  // Show loading
  const loadingId = addMessage('Thinking...', 'bot', true);

  try {
    const response = await fetch(`${API_URL}/chat/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, user: 'Admin' })
    });

    const data = await response.json();

    // Remove loading message
    document.getElementById(loadingId).remove();

    // Add bot response
    addMessage(data.answer, 'bot');

    // Show related documents
    if (data.relatedDocuments && data.relatedDocuments.length > 0) {
      showRelatedDocuments(data.relatedDocuments);
    }

  } catch (error) {
    console.error('Chat error:', error);
    document.getElementById(loadingId).remove();
    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
  }
}

// Add message to chat
function addMessage(text, type, isLoading = false) {
  const messageDiv = document.createElement('div');
  const messageId = 'msg-' + Date.now();
  messageDiv.id = messageId;
  messageDiv.className = `message ${type}-message`;

  const avatar = type === 'user' ? '👤' : '🤖';

  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      ${isLoading ? '<div class="loading"></div>' : `<p>${text}</p>`}
    </div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageId;
}

// Show related documents
function showRelatedDocuments(docs) {
  const sidebar = document.getElementById('relatedDocs');
  const list = document.getElementById('relatedDocsList');

  list.innerHTML = '';

  docs.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'related-doc-item';
    item.innerHTML = `
      <div style="font-weight:600; margin-bottom:0.5rem;">${doc.name}</div>
      <div style="font-size:0.9rem; color:#666;">
        ${doc.category} • ${doc.summary?.substring(0, 100)}...
      </div>
    `;
    item.onclick = () => viewDocumentDetail(doc.id);
    list.appendChild(item);
  });

  sidebar.style.display = 'block';
}

function viewDocumentDetail(id) {
  // You can implement a modal or new page to show full document
  alert('View document: ' + id);
}