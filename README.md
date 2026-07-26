# 📄 Resume Builder API

A backend-focused REST API that allows users to register, build their resume, upload a profile photo, and download it as a PDF. Built with Node.js and Express, it features JWT-based authentication, Cloudinary cloud storage for photo uploads, and Puppeteer for dynamic PDF generation — all connected to a simple HTML/CSS/JS frontend.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| File Upload | Multer, Cloudinary |
| PDF Generation | Puppeteer |
| Frontend | HTML, CSS, Vanilla JS |

---

## 📁 Project Structure

```
resume-builder/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary setup
├── modules/
│   ├── auth/              # Register, Login, User model
│   ├── resume/            # Resume CRUD + PDF download
│   └── upload/            # Photo upload to Cloudinary
├── middleware/
│   └── auth.middleware.js # JWT verification
├── utils/
│   └── generatePDF.js     # Puppeteer PDF logic
├── public/                # Frontend (HTML, CSS, JS)
│   ├── index.html         # Login / Register
│   ├── dashboard.html     # Fill resume form
│   └── resume.html        # View + download resume
└── server.js              # Entry point
```

---

## 🔄 Code Flow

```
User (Browser)
    ↓
HTML form → fetch() API call
    ↓
Express Router → Middleware (JWT check)
    ↓
Controller (business logic)
    ↓
Mongoose → MongoDB (save/read data)
    ↓
[Photo]  → Multer → Cloudinary → save URL
[PDF]    → Puppeteer → generate PDF → send file
    ↓
JSON response back to browser
```

---

## 🔑 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns JWT |

### Resume
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/resume` | Protected | Create resume |
| GET | `/resume` | Protected | Get your resume |
| PUT | `/resume` | Protected | Update resume |
| GET | `/resume/download` | Protected | Download as PDF |
| GET | `/resume/:userId` | Public | View anyone's resume |

### Upload
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/upload/photo` | Protected | Upload profile photo |

---

## ⚙️ Setup & Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder

# 2. Install dependencies
npm install

# 3. Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 4. Run the server
npm run dev
```

Open `http://localhost:5000` in your browser.

---

