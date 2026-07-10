# 🤝 AI Powered Debt Relief & Financial Recovery Platform

An AI-powered debt management platform that helps users manage loans, analyze their financial condition, receive AI-powered financial insights, and explore debt recovery strategies.

Built using **FastAPI**, **React (Vite)**, **SQLite**, and **Google Gemini API**.

---

## 📌 Features

- 🔐 User Authentication using JWT
- 💰 Loan Management (Add, View, Delete Loans)
- 📊 AI Financial Analysis
- 🧠 Google Gemini AI Financial Insights
- 📈 Recovery Matrix
- 🛡️ Guidance & Compliance
- 🤝 Settlement Strategies
- 📖 Swagger API Documentation

---

## 🏗️ Project Architecture

```text
User
  ↓
React (Vite) Frontend
  ↓
FastAPI Backend
  ↓
Services Layer
 ├── Loan Manager
 ├── Financial Calculator
 ├── AI Analysis Engine
 ├── Recovery Strategy
 ├── Guidance & Compliance
 └── User Authentication
  ↓
SQLite Database + Google Gemini API
```

---

## 📂 Project Structure

```text
FinReliefAI/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── routes/
│       ├── models/
│       ├── schemas/
│       ├── security/
│       └── gemini_engine.py
│
├── frontend/
│
├── requirements.txt
├── README.md
└── .env
```

---

## ⚙️ Technologies Used

| Technology | Purpose |
|------------|---------|
| FastAPI | Backend API |
| React (Vite) | Frontend UI |
| SQLite | Database |
| SQLAlchemy | ORM |
| Google Gemini API | AI Analysis |
| Axios | API Communication |
| JWT | Authentication |
| Git & GitHub | Version Control |

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <your-github-repository-url>
cd FinReliefAI
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

Windows:
```bash
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ▶️ Run Backend

```bash
python -m uvicorn backend.app.main:app --reload
```

Backend:
```text
http://127.0.0.1:8000
```

Swagger:
```text
http://127.0.0.1:8000/docs
```

---

## ▶️ Run Frontend

```bash
npm install
npm run dev
```

Frontend:
```text
http://localhost:5173
```

---

## 🧪 Running Tests

```bash
pytest -v
```

---

## 🌟 Future Enhancements

- Cloud Deployment
- PostgreSQL/MySQL Support
- Personalized Financial Planning
- Advanced AI Recommendations
- Multi-user Scalability

---

## 👨‍💻 Author

Developed as part of a Google Cloud Generative AI internship project.

College : Anantha Lakshmi Institue of Technology and Sciences, Anantapur
Branch : B.Tech CSE(AIML)

Members 

1. Name : Sirivaram Sahithi
Email : sirivaramsahithi@gmail.com
Roll No : 232G1A33B5

2. Name : Shaik Mulla Sabiha Sultana
Email : sabihasultana12126@gmail.com
Roll No : 232G1A33B1

---
## 📜 License

This project was developed for educational purposes.
