# 📘 Overview

The **Digital Warranty & Bill Vault System** is a full-stack web application that helps users:

- Digitize physical bills  
- Extract warranty information using **OCR (Tesseract.js)**  
- Compute expiry dates automatically  
- Track active, expiring, and expired warranties  
- Receive expiry reminders  
- View analytics & dashboard insights  
- Manage all bills securely in one place  

This project mirrors a **real-world SaaS product**, featuring authentication, OCR, analytics, database storage, and an advanced UI.

---

# 🏗 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Axios

### **Backend**
- Node.js + Express.js
- PostgreSQL
- Sequelize ORM
- Multer file uploads
- Tesseract.js OCR engine
- JWT (JSON Web Token) Authentication
- Cron Jobs (Reminder System)

### **Tools**
- Thunder Client / Postman
- GitHub
- Vercel / Render

---

# 📂 Project Structure

digital-warranty-system/
│
├── frontend/ # Next.js (UI + Pages + Components)
├── backend/ # Express API + OCR + DB
├── README.md
└── .gitignore

---

# 🌟 Features

### 🔐 **Authentication**
- User Signup/Login using JWT  
- Protected Dashboard Routes  
- Logout functionality  

### 🧾 **Bill Upload**
- Upload bill images (JPG/PNG)  
- Multer stores file  
- Tesseract OCR extracts:  
  ✔ Product Name  
  ✔ Store Name  
  ✔ Purchase Date  
  ✔ Warranty Period  

### 🧮 **Smart Warranty Engine**
- Auto-calculates expiry date  
- Converts years/months into final expiry  
- Detects expired and expiring-soon warranties  

### 📊 **Dashboard**
- All bills in card layout  
- Status badges:  
  - 🟢 Active  
  - 🟡 Expiring Soon  
  - 🔴 Expired  
- X Days Left indicator  
- Filters:  
  ✔ Status  
  ✔ Year  
  ✔ Search  

### 📈 **Analytics Page**
- Total bills  
- Active warranties  
- Expired warranties  
- Expiring soon  
- More analytics (upcoming)

### 👤 **Profile Page**
- User information  
- Edit profile (future)  
- Logout  

### 🗑 **Actions on Each Bill**
- View Details page  
- Delete bill  
- Preview uploaded bill  

---

# ⚙️ Setup Instructions

# 🟣 Backend Setup (Node.js + PostgreSQL)

### 1. Navigate to backend folder
- cd backend
### 2. Install dependencies
- npm install
### 3. Create .env in backend
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=digital_warranty
JWT_SECRET=your_jwt_secret
PORT=3001
### 4. Create PostgreSQL database
CREATE DATABASE digital_warranty;
### 5. Start backend server
node server.js

Backend runs on:

http://localhost:3001

### 🔵 Frontend Setup (Next.js)
### 1. Navigate to frontend folder
cd frontend

### 2. Install dependencies
npm install

### 3. Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

### 4. Run development server
npm run dev

Frontend runs on:
http://localhost:3000

### 🧠 OCR Workflow (How Bill Extraction Works)
- User uploads bill

- Backend saves file using Multer

- Tesseract OCR reads the text

- Regex extracts key values

- Warranty expiry is calculated

- Bill details stored in PostgreSQL

- Dashboard updates instantly

### 🚀 Future Enhancements
🔮 AI Improvements
- GPT-powered OCR cleanup

- Line-item extraction

- 📩 Reminder System Upgrades

Email reminders (Nodemailer)

Push notifications

SMS alerts

- 💾 Cloud Integration
Upload bills to AWS S3

CDN optimization

- 📊 Analytics Dashboard
Monthly bills chart

Spend categories

Warranty distribution

- 📱 Mobile App (React Native)
Upload bill from camera

Sync with backend

### 🧑‍💻 Author
- Tarun R
- MCA – MS Ramaiah College
- Full-Stack Developer | Java | DevOps | Next.js

⭐ Support
If you find this project useful, consider giving the repository a ⭐ on GitHub!

















