# 📁 DocuMind AI - Intelligent Document Management System

An AI-powered document management system that automatically categorizes, summarizes, and enables semantic search across your uploaded documents using advanced LLM technology.

![DocuMind AI](https://img.shields.io/badge/AI-Powered-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

---

## ✨ Features

- 🤖 **AI-Powered Analysis**: Automatic document summarization and categorization using Groq llm
- 📄 **Multi-Format Support**: Upload PDF, DOCX, and TXT files
- 🔍 **Semantic Search**: Find documents using natural language queries
- 💬 **Conversational Q&A**: Ask questions about your documents and get instant answers
- 📊 **Analytics Dashboard**: Track document statistics, categories, and storage
- 🏷️ **Smart Tagging**: Automatic tag generation for easy organization
- 🎨 **Modern UI**: Clean, responsive interface built with vanilla JavaScript

## 📸 Screenshots
### Dashboard
![Dashboard](./screenshots/dashboard.png)


### Document Upload
![Upload](./screenshots/upload.png)

### Chat Interface
![Chat](./screenshots/chat.png)

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Groq SDK** - LLM integration (Llama 3.3 70B)
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### Frontend
- **HTML5/CSS3** - Structure & styling
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - HTTP requests

### AI/ML
- **Groq API** - Fast LLM inference
- **Llama 3.3 70B** - Language model

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **MongoDB** (Local or Atlas) ([Download](https://www.mongodb.com/try/download/community))
- **Groq API Key** ([Get Free Key](https://console.groq.com/))

---

## ⚡ Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Divjyo15/document-management-system.git
cd document-management-system
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

### 3️⃣ Environment Variables

Create `.env` file in `backend/` folder:
```env
# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/document-management

# OR MongoDB Atlas (Production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/document-management

# Groq API
GROQ_API_KEY=gsk_your_api_key_here

# Server Port
PORT=5000
```

### 4️⃣ Start MongoDB

**Option A: MongoDB Compass (Easiest)**
- Download & install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- Open Compass - server starts automatically

**Option B: Command Line**
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5️⃣ Run the Application
```bash
# Backend
cd backend
npm start

# Open Frontend
# Navigate to http://localhost:5000
```

---


4. **Add Environment Variables**
```
   MONGODB_URI=mongodb+srv://...
   GROQ_API_KEY=gsk_...
   NODE_ENV=production
```
## 📁 Project Structure
```
document-management-system/
│
├── backend/
│   ├── models/
│   │   ├── Document.js          # Document schema
│   │   └── Query.js              # Query history schema
│   │
│   ├── routes/
│   │   ├── documents.js          # Document CRUD routes
│   │   └── chat.js               # Chat/Q&A routes
│   │
│   ├── services/
│   │   ├── documentParser.js     # PDF/DOCX text extraction
│   │   └── llmService.js         # Groq API integration
│   │
│   ├── uploads/                  # Temporary file storage
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── server.js                 # Express server
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── style.css             # Styles
│   │
│   ├── js/
│   │   ├── dashboard.js          # Document list & stats
│   │   ├── upload.js             # File upload logic
│   │   └── chat.js               # Chat interface
│   │
│   ├── index.html                # Main dashboard
│   ├── dashboard.html            # Document details
│   └── chat.html                 # Chat interface
│
└── README.md
```

---

## 🔧 Configuration

### Supported File Types

- **PDF** (.pdf) - Up to 10MB
- **Word Documents** (.docx) - Up to 10MB  
- **Text Files** (.txt) - Up to 10MB

### Document Categories

The system auto-categorizes documents into:
- Contract
- Invoice
- Report
- Memo
- Presentation
- Policy
- Email
- Letter
- Other

---

## 🎯 API Endpoints

### Documents
```
POST   /api/documents/upload      # Upload & analyze document
GET    /api/documents/list        # Get all documents
GET    /api/documents/:id         # Get single document
DELETE /api/documents/:id         # Delete document
GET    /api/documents/stats/overview  # Get statistics
```

### Chat
```
POST   /api/chat/ask              # Ask question about documents
GET    /api/chat/history          # Get query history
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes | - |
| `GROQ_API_KEY` | Groq API key | ✅ Yes | - |
| `PORT` | Server port | ❌ No | 5000 |
| `NODE_ENV` | Environment | ❌ No | development |


## 🙏 Acknowledgments

- [Groq](https://groq.com/) - For blazing-fast LLM inference
- [MongoDB](https://www.mongodb.com/) - For flexible document storage
---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/document-management-system?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/document-management-system?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/document-management-system)

---

## 🗺️ Roadmap

- [ ] Add user authentication & authorization
- [ ] Implement cloud storage (AWS S3/Cloudinary)
- [ ] Add OCR for scanned documents
- [ ] Multi-language support
- [ ] Document version control
- [ ] Advanced search filters
- [ ] Export documents as ZIP
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

## 💡 Usage Examples

### Upload a Document
```javascript
const formData = new FormData();
formData.append('document', fileInput.files[0]);

fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Ask a Question
```javascript
fetch('http://localhost:5000/api/chat/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What are the payment terms in the contract?'
  })
})
.then(res => res.json())
.then(data => console.log(data.answer));
```

---

## ⚠️ Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows: Open MongoDB Compass
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### File Upload Fails

- Check file size (max 10MB)
- Check file type (PDF, DOCX, TXT only)
- Check uploads folder exists and has write permissions

### AI Generation Fails

- Verify `GROQ_API_KEY` in `.env`
- Check API quota at [console.groq.com](https://console.groq.com)
- Rate limit: 30 requests/minute (free tier)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check [Issues](https://github.com/Divjyo15/document-management-system/issues)
2. Create a new issue with detailed description

---

**Made with ❤️ by Divya**

⭐ Star this repo if you find it helpful!
