
# Anuncia AI  
## AI-Powered Retail Media Creative Studio

Anuncia AI is a full-stack web application that automates the creation of **retailer-compliant, high-quality ad creatives** for Retail Media Networks (RMNs).  
It transforms minimal brand inputs (logo + product packshot) into **editable, multi-format ad creatives** using **AI-generated structured layouts**, ensuring speed, compliance, and scalability.

---

## 🚀 What the Software Does

Anuncia AI solves a critical Retail Media bottleneck:  
**slow, expensive, and error-prone creative production.**

DEMO VIDEO: https://drive.google.com/file/d/18MvW4lm1OAYzx4uY9rL9Ix0midrwHksY/view?usp=sharing

### Key Capabilities

#### AI-Generated Structured Layouts
Uses **Gemini GenAI** to generate **machine-readable JSON layouts** (positions, sizes, safe zones, hierarchy) instead of static images.

#### Editable Canvas (No Re-generation Needed)
AI provides structure → users fine-tune on a **React + Fabric.js canvas**.

#### Multi-Format Support
Generate creatives for:
- Instagram / Facebook Stories (1080×1920)
- Instagram Posts (1080×1080)
- Facebook Ads (1200×628)

#### Platform-Aware Compliance Validation
Real-time validation for:
- Safe zones (Stories)
- Minimum font sizes (accessibility)
- Canvas size & placement rules  

With visual highlighting of violations.

#### Optimized Media Pipeline
**Cloudinary** handles image optimization, background removal, and output constraints.

---

## 🧱 Architecture Overview

### Frontend
- React  
- Fabric.js (custom canvas renderer)  
- Zustand (state management)  

### Backend
- Go (Chi router)  
- PostgreSQL (BrandKit & metadata)  
- Cloudinary (media pipeline)  

### AI Layer
- Gemini GenAI (Structured Output → Layout JSON)

### Workflow
```

User Assets → Backend (Go)
→ Gemini (Layout JSON)
→ Frontend Canvas Renderer
→ User Edits + Validation
→ Download / Export

````

---

## 🛠 How to Run the Project Locally

### Prerequisites
- Go (>= 1.20)
- Node.js (>= 18)
- npm
- Git

---
---

## 🐳 Backend via Docker (Recommended)

The Go backend of Anuncia AI is **Dockerized** to ensure:
- Consistent runtime environments
- Easy local setup
- Deployment readiness and scalability

### Prerequisites
- Docker
- Docker Desktop running

### Build the backend image
```bash
cd go-api
docker build -t anuncia-backend .
go run main.go
````

This starts the backend server responsible for:

* Asset handling
* AI orchestration
* Database interactions

---

## 🔹 Frontend Setup (Canvas UI)

Open a new terminal:

```bash
cd canvas-ui
npm install
npm run dev
```

This starts the frontend development server with:

* Multi-step creative flow
* Editable canvas
* Validation & export

---

## 🌐 Accessing the App

Once both servers are running:

* Frontend will be available at the URL shown by `npm run dev`
  (usually `http://localhost:5173`)
* Backend runs on its configured Go server port

---

## 📁 Repository Structure (Simplified)

```
.
├── go-api/          # Go backend (AI orchestration, APIs)
├── canvas-ui/       # React frontend (Canvas editor)
├── README.md
```

---

## 🎥 Demo

A short demo video (2–4 minutes) showcasing:

* Asset upload
* AI layout generation
* Canvas editing
* Validation
* Export

📎 **Demo Video Link:** *(add GitHub-hosted link here)*

---

## 💡 Why This Is Unique

* Uses **structured AI layouts**, not pixel generation
* Enforces **compliance by design**
* Enables **human-in-the-loop editing without regeneration**
* Designed specifically for **Retail Media workflows**, not generic design tools

---

## 🧩 Future Improvements

* AI text safety & forbidden-claim detection
* Visual contrast & accessibility scoring
* Collaborative review workspace
* Performance prediction for creatives
* Support for DOOH & in-store screens

---

## 👥 Team

* **Aryan Gupta** — Backend Engineering & Machine Learning
* **Aanya Singh Dhaka** — Frontend Engineering, ML & User Experience


